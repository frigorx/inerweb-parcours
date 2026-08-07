"""Construit un maillage WebGL local et allégé depuis le STEP fourni par Franck.

Le fichier produit ne contient aucune logique métier. Il sert uniquement à la vue
extérieure de reconnaissance du prototype inerWeb.
"""

from __future__ import annotations

import json
import math
import os
import pathlib
import tempfile

import cadquery as cq
import vtk


ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = pathlib.Path(os.environ.get("KV_STEP", r"C:\Users\henni\Downloads\ID542975703082-0101.stp"))
DESTINATION = ROOT / "assets" / "mesh-kvl.js"


def triangle_normal(a: tuple[float, float, float], b: tuple[float, float, float], c: tuple[float, float, float]):
    ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
    length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    return nx / length, ny / length, nz / length


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)

    shape = cq.importers.importStep(str(SOURCE)).val()
    with tempfile.TemporaryDirectory(prefix="inerweb-kv-") as temporary:
        raw_stl = pathlib.Path(temporary) / "source.stl"
        cq.exporters.export(shape, str(raw_stl), tolerance=0.2, angularTolerance=0.15)

        reader = vtk.vtkSTLReader()
        reader.SetFileName(str(raw_stl))
        reader.Update()

        triangles = vtk.vtkTriangleFilter()
        triangles.SetInputConnection(reader.GetOutputPort())

        clean = vtk.vtkCleanPolyData()
        clean.SetInputConnection(triangles.GetOutputPort())

        decimate = vtk.vtkQuadricDecimation()
        decimate.SetInputConnection(clean.GetOutputPort())
        decimate.SetTargetReduction(0.78)
        decimate.Update()
        poly = decimate.GetOutput()

    bounds = poly.GetBounds()
    center = (
        (bounds[0] + bounds[1]) / 2,
        (bounds[2] + bounds[3]) / 2,
        (bounds[4] + bounds[5]) / 2,
    )
    longest = max(bounds[1] - bounds[0], bounds[3] - bounds[2], bounds[5] - bounds[4]) or 1.0
    scale = 2.35 / longest

    vertices: list[float] = []
    normals: list[float] = []
    cells = poly.GetPolys()
    cells.InitTraversal()
    ids = vtk.vtkIdList()
    while cells.GetNextCell(ids):
        if ids.GetNumberOfIds() != 3:
            continue
        points = [poly.GetPoint(ids.GetId(i)) for i in range(3)]
        normal = triangle_normal(points[0], points[1], points[2])
        for point in points:
            vertices.extend(round((point[i] - center[i]) * scale, 5) for i in range(3))
            normals.extend(round(value, 5) for value in normal)

    payload = {
        "source": SOURCE.name,
        "triangles": len(vertices) // 9,
        "vertices": vertices,
        "normals": normals,
    }
    DESTINATION.write_text(
        "window.KV_PRODUCT_MESH=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"{SOURCE.name}: {payload['triangles']} triangles -> {DESTINATION} ({DESTINATION.stat().st_size} octets)")


if __name__ == "__main__":
    main()
