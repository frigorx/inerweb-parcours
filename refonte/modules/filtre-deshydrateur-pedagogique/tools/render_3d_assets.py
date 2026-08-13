"""Rend des vues 3D pédagogiques originales pour le module filtre-déshydrateur.

Ces images servent à relier la forme réelle du matériel au schéma fonctionnel.
Elles ne représentent aucune référence constructeur précise.
"""

from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"
SCALE = 2
W, H = 1600 * SCALE, 900 * SCALE
random.seed(47)


def sc(value: float) -> int:
    return round(value * SCALE)


def box(values: tuple[float, float, float, float]) -> tuple[int, int, int, int]:
    return tuple(sc(value) for value in values)


def warm_background() -> Image.Image:
    image = Image.new("RGB", (W, H), "#fffdf8")
    pixels = image.load()
    for y in range(H):
        for x in range(W):
            dx = (x - W * 0.5) / W
            dy = (y - H * 0.42) / H
            glow = max(0.0, 1.0 - math.sqrt(dx * dx + dy * dy) * 1.75)
            grain = random.randint(-2, 2)
            pixels[x, y] = (
                max(0, min(255, round(247 + glow * 8 + grain))),
                max(0, min(255, round(241 + glow * 11 + grain))),
                max(0, min(255, round(231 + glow * 15 + grain))),
            )
    return image


def shadow(image: Image.Image, bounds: tuple[float, float, float, float], radius: int = 34, opacity: int = 72) -> None:
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse(box(bounds), fill=(16, 35, 60, opacity))
    layer = layer.filter(ImageFilter.GaussianBlur(sc(radius)))
    image.paste(layer, (0, 0), layer)


def horizontal_gradient(
    size: tuple[int, int], stops: list[tuple[float, tuple[int, int, int]]]
) -> Image.Image:
    width, height = size
    strip = Image.new("RGB", (1, height))
    pixels = strip.load()
    for y in range(height):
        position = y / max(1, height - 1)
        left = stops[0]
        right = stops[-1]
        for index in range(len(stops) - 1):
            if stops[index][0] <= position <= stops[index + 1][0]:
                left, right = stops[index], stops[index + 1]
                break
        span = max(0.0001, right[0] - left[0])
        amount = (position - left[0]) / span
        color = tuple(round(left[1][channel] + (right[1][channel] - left[1][channel]) * amount) for channel in range(3))
        pixels[0, y] = color
    return strip.resize((width, height))


def paste_rounded_gradient(
    image: Image.Image,
    bounds: tuple[float, float, float, float],
    radius: float,
    stops: list[tuple[float, tuple[int, int, int]]],
    outline: tuple[int, int, int] | None = None,
    outline_width: int = 0,
) -> None:
    x1, y1, x2, y2 = box(bounds)
    size = (x2 - x1, y2 - y1)
    gradient = horizontal_gradient(size, stops)
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=sc(radius), fill=255)
    image.paste(gradient, (x1, y1), mask)
    if outline:
        ImageDraw.Draw(image).rounded_rectangle(box(bounds), radius=sc(radius), outline=outline, width=sc(outline_width))


def copper_tube(image: Image.Image, bounds: tuple[float, float, float, float], radius: float = 24) -> None:
    paste_rounded_gradient(
        image,
        bounds,
        radius,
        [
            (0.0, (112, 51, 26)),
            (0.18, (183, 91, 48)),
            (0.42, (255, 184, 123)),
            (0.60, (196, 99, 55)),
            (1.0, (101, 43, 24)),
        ],
        outline=(104, 47, 28),
        outline_width=3,
    )


def porous_texture(image: Image.Image, bounds: tuple[float, float, float, float], count: int, color=(93, 78, 48)) -> None:
    x1, y1, x2, y2 = box(bounds)
    draw = ImageDraw.Draw(image, "RGBA")
    for _ in range(count):
        x = random.randint(x1 + sc(8), x2 - sc(8))
        y = random.randint(y1 + sc(8), y2 - sc(8))
        radius = random.randint(sc(1), sc(3))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(*color, random.randint(70, 145)))


def render_cutaway() -> None:
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (180, 650, 1420, 820), radius=30, opacity=78)

    copper_tube(image, (70, 402, 310, 500), 46)
    copper_tube(image, (1290, 402, 1530, 500), 46)

    # Enveloppe métallique avec ouverture en coupe sur la face avant.
    paste_rounded_gradient(
        image,
        (250, 200, 1350, 690),
        210,
        [(0.0, (12, 30, 50)), (0.14, (43, 70, 98)), (0.34, (91, 116, 139)), (0.55, (36, 60, 86)), (1.0, (8, 22, 38))],
        outline=(8, 25, 45),
        outline_width=12,
    )
    # Fenêtre intérieure, bord de coupe acier clair.
    draw.rounded_rectangle(box((302, 268, 1298, 624)), radius=sc(146), fill=(185, 199, 210, 255), outline=(231, 238, 242, 255), width=sc(18))
    draw.rounded_rectangle(box((330, 296, 1270, 596)), radius=sc(122), fill=(239, 235, 219, 255), outline=(74, 93, 110, 255), width=sc(7))

    # Ressort de maintien.
    points = []
    for index in range(13):
        x = sc(370 + index * 27)
        y = sc(445 + (54 if index % 2 else -54))
        points.append((x, y))
    draw.line(points, fill=(188, 70, 26, 255), width=sc(14), joint="curve")
    draw.line((sc(345), sc(445), sc(370), sc(445)), fill=(188, 70, 26, 255), width=sc(14))

    # Noyau poreux.
    paste_rounded_gradient(
        image,
        (690, 315, 1080, 580),
        58,
        [(0.0, (111, 90, 51)), (0.10, (181, 160, 111)), (0.34, (230, 214, 170)), (0.72, (183, 158, 105)), (1.0, (91, 72, 42))],
        outline=(103, 82, 45),
        outline_width=8,
    )
    porous_texture(image, (710, 335, 1060, 560), 180)

    # Feutrine / média filtrant et plaque perforée.
    draw.rounded_rectangle(box((1100, 320, 1178, 576)), radius=sc(22), fill=(244, 240, 226, 255), outline=(201, 69, 25, 255), width=sc(6))
    for y in range(sc(342), sc(558), sc(18)):
        draw.line((sc(1112), y, sc(1165), y + sc(7)), fill=(177, 164, 139, 120), width=sc(2))
    draw.rounded_rectangle(box((1190, 310, 1226, 586)), radius=sc(12), fill=(103, 121, 137, 255), outline=(26, 53, 79, 255), width=sc(5))
    for y in range(334, 570, 32):
        draw.ellipse(box((1197, y, 1219, y + 22)), fill=(244, 246, 247, 255), outline=(29, 55, 82, 255), width=sc(3))

    # Reflets et lignes de coupe pour un aspect rendu produit.
    draw.arc(box((277, 221, 1323, 670)), 202, 333, fill=(255, 255, 255, 95), width=sc(8))
    draw.line((sc(334), sc(332), sc(1262), sc(332)), fill=(255, 255, 255, 90), width=sc(5))

    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "coupe-filtre-3d.webp", "WEBP", quality=90, method=6)


def porous_core(
    image: Image.Image,
    bounds: tuple[float, float, float, float],
    opening: bool = True,
) -> None:
    x1, y1, x2, y2 = bounds
    paste_rounded_gradient(
        image,
        bounds,
        (y2 - y1) * 0.28,
        [
            (0.0, (104, 82, 45)),
            (0.12, (181, 158, 105)),
            (0.38, (232, 216, 172)),
            (0.68, (181, 153, 96)),
            (1.0, (82, 63, 36)),
        ],
        outline=(92, 70, 39),
        outline_width=5,
    )
    porous_texture(image, (x1 + 12, y1 + 12, x2 - 12, y2 - 12), 150)
    if opening:
        draw = ImageDraw.Draw(image, "RGBA")
        depth = (y2 - y1) * 0.18
        draw.ellipse(
            box((x2 - depth * 1.15, y1 + 8, x2 + depth * 0.55, y2 - 8)),
            fill=(87, 69, 41, 255),
            outline=(226, 210, 165, 255),
            width=sc(5),
        )
        draw.ellipse(
            box((x2 - depth * 0.52, y1 + (y2 - y1) * 0.31, x2 + depth * 0.20, y2 - (y2 - y1) * 0.31)),
            fill=(27, 43, 56, 255),
        )


def render_cartridge() -> None:
    """Porte-cartouche cohérent : noyaux coaxiaux dans l'enveloppe, couvercle boulonné."""
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (120, 680, 1470, 820), radius=32, opacity=78)

    copper_tube(image, (55, 430, 245, 520), 38)
    copper_tube(image, (1125, 430, 1315, 520), 38)

    # Enveloppe et bride : la moitié supérieure est ouverte pour rendre l'empilage visible.
    paste_rounded_gradient(
        image,
        (195, 235, 1165, 690),
        170,
        [(0.0, (12, 29, 49)), (0.18, (39, 74, 109)), (0.40, (91, 123, 153)), (0.65, (31, 63, 96)), (1.0, (8, 24, 42))],
        outline=(8, 24, 43),
        outline_width=11,
    )
    # Fenêtre de coupe, limitée à la partie utile de l'enveloppe.
    draw.rounded_rectangle(box((280, 300, 1080, 605)), radius=sc(118), fill=(225, 224, 211, 255), outline=(226, 234, 239, 255), width=sc(14))
    draw.rounded_rectangle(box((305, 326, 1060, 580)), radius=sc(98), fill=(244, 240, 225, 255), outline=(58, 78, 96, 255), width=sc(5))

    # Tige centrale, deux noyaux successifs et joints feutre : tout est dans le même axe.
    draw.rounded_rectangle(box((340, 445, 1068, 468)), radius=sc(10), fill=(105, 116, 124, 255), outline=(46, 58, 68, 255), width=sc(3))
    for x1, x2 in ((365, 675), (710, 1020)):
        porous_core(image, (x1, 355, x2, 555), opening=True)
    for x in (340, 690, 1035):
        draw.rounded_rectangle(box((x, 348, x + 22, 562)), radius=sc(8), fill=(241, 238, 225, 255), outline=(183, 170, 143, 255), width=sc(3))

    # Tamis métallique et plaque de maintien juste avant la sortie.
    draw.rounded_rectangle(box((1045, 342, 1080, 568)), radius=sc(8), fill=(91, 108, 121, 255), outline=(31, 53, 71, 255), width=sc(4))
    for y in range(360, 555, 25):
        draw.ellipse(box((1054, y, 1072, y + 18)), fill=(239, 242, 243, 255), outline=(38, 60, 77, 255), width=sc(2))

    # Bride solidaire du corps, joint et couvercle déplacé dans l'axe de démontage.
    draw.rounded_rectangle(box((1080, 255, 1170, 670)), radius=sc(35), fill=(48, 70, 88, 255), outline=(7, 25, 43, 255), width=sc(9))
    draw.rounded_rectangle(box((1190, 270, 1222, 655)), radius=sc(14), fill=(193, 66, 33, 210), outline=(117, 41, 24, 255), width=sc(4))
    paste_rounded_gradient(
        image,
        (1275, 250, 1410, 675),
        38,
        [(0.0, (64, 75, 84)), (0.19, (185, 194, 200)), (0.45, (238, 241, 243)), (0.73, (145, 155, 164)), (1.0, (52, 63, 73))],
        outline=(48, 60, 70),
        outline_width=8,
    )
    for angle in range(0, 360, 45):
        cx, cy = 1342, 462
        x = cx + math.cos(math.radians(angle)) * 47
        y = cy + math.sin(math.radians(angle)) * 180
        draw.ellipse(box((x - 9, y - 9, x + 9, y + 9)), fill=(59, 69, 77, 255), outline=(239, 241, 242, 255), width=sc(2))

    # Ressort de maintien porté par le couvercle.
    points = []
    for index in range(9):
        x = sc(1105 + index * 20)
        y = sc(457 + (34 if index % 2 else -34))
        points.append((x, y))
    draw.line(points, fill=(184, 67, 27, 255), width=sc(9), joint="curve")
    draw.arc(box((225, 258, 1145, 660)), 198, 331, fill=(255, 255, 255, 78), width=sc(7))
    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "filtre-cartouche-3d.webp", "WEBP", quality=91, method=6)


def render_solid_core() -> None:
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (220, 615, 1390, 780), radius=30, opacity=74)
    porous_core(image, (280, 280, 1290, 630), opening=True)
    draw.ellipse(box((245, 300, 430, 610)), fill=(124, 101, 60, 255), outline=(228, 213, 172, 255), width=sc(7))
    draw.ellipse(box((295, 385, 397, 530)), fill=(30, 45, 58, 255), outline=(91, 72, 42, 255), width=sc(5))
    draw.arc(box((330, 300, 1230, 600)), 202, 333, fill=(255, 255, 255, 100), width=sc(8))
    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "noyau-solide-3d.webp", "WEBP", quality=91, method=6)


def render_filter_media() -> None:
    """Gros plan 3D du média filtrant : particules retenues, fluide traversant."""
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (150, 665, 1450, 815), radius=28, opacity=72)
    copper_tube(image, (70, 395, 330, 500), 40)
    copper_tube(image, (1270, 395, 1530, 500), 40)
    paste_rounded_gradient(
        image,
        (265, 235, 1335, 670),
        172,
        [(0.0, (12, 29, 50)), (0.20, (46, 78, 107)), (0.43, (96, 121, 141)), (0.66, (35, 63, 89)), (1.0, (9, 24, 41))],
        outline=(8, 24, 43),
        outline_width=10,
    )
    draw.rounded_rectangle(box((330, 305, 1270, 600)), radius=sc(112), fill=(222, 233, 240, 255), outline=(233, 239, 243, 255), width=sc(12))
    # Noyau poreux puis feutre/tamis visible en gros plan.
    porous_core(image, (520, 335, 965, 570), opening=False)
    draw.rounded_rectangle(box((985, 320, 1072, 585)), radius=sc(20), fill=(246, 241, 226, 255), outline=(195, 68, 27, 255), width=sc(6))
    for y in range(340, 570, 16):
        draw.line((sc(997), sc(y), sc(1060), sc(y + 7)), fill=(173, 157, 131, 150), width=sc(2))
    draw.rounded_rectangle(box((1087, 315, 1128, 590)), radius=sc(10), fill=(91, 109, 124, 255), outline=(28, 52, 72, 255), width=sc(5))
    for y in range(335, 575, 27):
        draw.ellipse(box((1097, y, 1119, y + 22)), fill=(240, 242, 243, 255), outline=(34, 57, 74, 255), width=sc(2))
    # Calamine, copeaux et poussières arrêtés côté amont du média.
    for index in range(34):
        x = random.uniform(395, 970)
        y = random.uniform(355, 550)
        size = random.uniform(5, 15)
        color = (49, 45, 42, 235) if index % 3 else (151, 58, 28, 235)
        draw.polygon(
            [(sc(x), sc(y - size)), (sc(x + size), sc(y)), (sc(x), sc(y + size)), (sc(x - size), sc(y))],
            fill=color,
        )
    # Quelques particules sont clairement bloquées juste devant le feutre.
    for y in (370, 415, 468, 520, 553):
        draw.ellipse(box((953, y, 980, y + 27)), fill=(44, 41, 39, 255), outline=(184, 64, 29, 255), width=sc(2))
    draw.arc(box((295, 255, 1305, 640)), 199, 333, fill=(255, 255, 255, 82), width=sc(7))
    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "filtration-tamis-3d.webp", "WEBP", quality=91, method=6)


def render_biflow() -> None:
    """Coupe symétrique : un média filtrant à chaque extrémité du noyau."""
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (130, 675, 1470, 820), radius=30, opacity=76)
    copper_tube(image, (45, 405, 290, 500), 38)
    copper_tube(image, (1310, 405, 1555, 500), 38)
    paste_rounded_gradient(
        image,
        (235, 220, 1365, 690),
        188,
        [(0.0, (10, 27, 47)), (0.18, (42, 73, 104)), (0.40, (92, 119, 143)), (0.64, (32, 61, 89)), (1.0, (8, 22, 39))],
        outline=(8, 24, 43),
        outline_width=11,
    )
    draw.rounded_rectangle(box((305, 292, 1295, 610)), radius=sc(132), fill=(231, 232, 218, 255), outline=(235, 241, 244, 255), width=sc(14))
    porous_core(image, (505, 330, 1095, 575), opening=False)
    for x in (410, 1115):
        draw.rounded_rectangle(box((x, 320, x + 72, 590)), radius=sc(18), fill=(246, 241, 225, 255), outline=(194, 68, 27, 255), width=sc(6))
        for y in range(338, 575, 17):
            draw.line((sc(x + 10), sc(y), sc(x + 62), sc(y + 7)), fill=(169, 154, 129, 155), width=sc(2))
    # Petits clapets de principe de part et d'autre, sans prétendre reproduire un constructeur.
    draw.polygon([ (sc(350), sc(415)), (sc(395), sc(455)), (sc(350), sc(495)) ], fill=(61, 127, 202, 245), outline=(20, 56, 91, 255))
    draw.polygon([ (sc(1250), sc(415)), (sc(1205), sc(455)), (sc(1250), sc(495)) ], fill=(61, 127, 202, 245), outline=(20, 56, 91, 255))
    draw.arc(box((265, 245, 1335, 655)), 200, 332, fill=(255, 255, 255, 80), width=sc(7))
    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "biflow-coupe-3d.webp", "WEBP", quality=91, method=6)


def render_burnout() -> None:
    """Filtre d'aspiration générique avec deux prises de pression de contrôle."""
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (110, 650, 1490, 810), radius=30, opacity=78)
    copper_tube(image, (45, 420, 330, 525), 40)
    copper_tube(image, (1270, 420, 1555, 525), 40)
    paste_rounded_gradient(
        image,
        (265, 235, 1335, 700),
        190,
        [(0.0, (12, 24, 35)), (0.18, (45, 53, 61)), (0.38, (94, 101, 105)), (0.58, (34, 41, 47)), (1.0, (9, 18, 27))],
        outline=(12, 25, 38),
        outline_width=11,
    )
    # Prises Schrader près de l'entrée et de la sortie pour contrôler la chute de pression.
    for x in (410, 1190):
        copper_tube(image, (x, 180, x + 70, 310), 18)
        draw.rounded_rectangle(box((x - 10, 145, x + 80, 210)), radius=sc(16), fill=(184, 139, 58, 255), outline=(105, 70, 27, 255), width=sc(5))
        draw.ellipse(box((x + 14, 155, x + 56, 197)), fill=(45, 55, 60, 255), outline=(229, 219, 190, 255), width=sc(3))
    draw.arc(box((300, 260, 1300, 665)), 199, 332, fill=(255, 255, 255, 85), width=sc(8))
    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "filtre-burnout-3d.webp", "WEBP", quality=91, method=6)


def prepare_beads_photo() -> None:
    source = ROOT / "assets" / "photos" / "tamis-moleculaire-4a-source.jpg"
    if not source.exists():
        return
    photo = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    photo = ImageOps.fit(photo, (1200, 900), method=Image.Resampling.LANCZOS, centering=(0.5, 0.48))
    photo.save(OUT / "tamis-moleculaire-billes.webp", "WEBP", quality=86, method=6)


def render_cigar() -> None:
    image = warm_background()
    draw = ImageDraw.Draw(image, "RGBA")
    shadow(image, (205, 610, 1395, 780), radius=28, opacity=74)
    copper_tube(image, (90, 425, 455, 490), 26)
    copper_tube(image, (1145, 425, 1510, 490), 26)
    paste_rounded_gradient(
        image,
        (390, 290, 1210, 625),
        158,
        [(0.0, (99, 41, 22)), (0.16, (174, 78, 39)), (0.36, (248, 171, 104)), (0.52, (210, 110, 59)), (0.74, (151, 63, 33)), (1.0, (76, 31, 19))],
        outline=(103, 45, 26),
        outline_width=9,
    )
    # Bourrelets de sertissage et reflets cuivre.
    for x in (455, 1145):
        draw.line((sc(x), sc(330), sc(x), sc(586)), fill=(82, 34, 20, 230), width=sc(8))
        draw.line((sc(x + 12), sc(340), sc(x + 12), sc(576)), fill=(255, 201, 147, 95), width=sc(4))
    draw.arc(box((422, 314, 1178, 604)), 198, 337, fill=(255, 229, 197, 125), width=sc(9))
    for _ in range(110):
        x = random.randint(sc(450), sc(1150))
        y = random.randint(sc(335), sc(585))
        draw.point((x, y), fill=(69, 29, 17, random.randint(25, 70)))

    image.resize((1600, 900), Image.Resampling.LANCZOS).save(OUT / "filtre-cigare-3d.webp", "WEBP", quality=90, method=6)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    render_cutaway()
    render_cartridge()
    render_solid_core()
    render_filter_media()
    render_biflow()
    render_burnout()
    prepare_beads_photo()
    render_cigar()


if __name__ == "__main__":
    main()
