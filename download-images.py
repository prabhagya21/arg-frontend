#!/usr/bin/env python3
"""Download every arg.lk image used by the site into assets/images/.

Run once from the project folder:   python3 download-images.py
(Needs only Python 3 — no extra packages. Files that already exist are skipped.)
Until you run it, the pages still work: each <img> falls back to its arg.lk copy.
"""
import os, sys, urllib.request

IMAGES = [
    ('https://www.arg.lk/wp-content/uploads/2024/07/2015-2016-1st-Runner-Up-of-the-Best-Distribuotr-Of-JAT-Holdings-PLC_result-1.webp',
     'assets/images/awards/2015-2016-1st-Runner-Up-of-the-Best-Distribuotr-Of-JAT-Holdings-PLC_result-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/ARPICO-Plastishells-Best-Performing-Trophy-2005_result.webp',
     'assets/images/awards/ARPICO-Plastishells-Best-Performing-Trophy-2005_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/An-Appreciation-Trophy-From-the-Staff-Of-ARG-2013_result.webp',
     'assets/images/awards/An-Appreciation-Trophy-From-the-Staff-Of-ARG-2013_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/An-Appreciation-Trophy-From-the-Staff-Of-ARG_result.webp',
     'assets/images/awards/An-Appreciation-Trophy-From-the-Staff-Of-ARG_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/An-Appreciation-Trophy_result.webp',
     'assets/images/awards/An-Appreciation-Trophy_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/Best-Service-Recognition-Trophy_result.webp',
     'assets/images/awards/Best-Service-Recognition-Trophy_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/Director-Of-A.R.G-Mr.Ananda-Was-Awarded-From-a-Honorary-Name-in-2022_result.webp',
     'assets/images/awards/Director-Of-A.R.G-Mr.Ananda-Was-Awarded-From-a-Honorary-Name-in-2022_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/Director-Of-A.R.G-Mr.Ananda-Was-Awarded-as-Justice-In-Peace-All-Island-in-2014_result.webp',
     'assets/images/awards/Director-Of-A.R.G-Mr.Ananda-Was-Awarded-as-Justice-In-Peace-All-Island-in-2014_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/INSEE-Cement-Top-Performer-2019_result.webp',
     'assets/images/awards/INSEE-Cement-Top-Performer-2019_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/Outstanding-Performance-Trophy-2015-2016-from-JAT-Holdings-PLC_result.webp',
     'assets/images/awards/Outstanding-Performance-Trophy-2015-2016-from-JAT-Holdings-PLC_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/S-LON-Dealer-Evaluation-Trophy-2004_result.webp',
     'assets/images/awards/S-LON-Dealer-Evaluation-Trophy-2004_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/Together-Towards-Success-Trophy_result.webp',
     'assets/images/awards/Together-Towards-Success-Trophy_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/Trophy-From-Galagedara-Police_result.webp',
     'assets/images/awards/Trophy-From-Galagedara-Police_result.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/10/Untitled-design-64.png',
     'assets/images/companies/Untitled-design-64.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/10/Untitled-design-66.png',
     'assets/images/companies/Untitled-design-66.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/10/Untitled-design-67.png',
     'assets/images/companies/Untitled-design-67.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/10/Untitled-design-68.png',
     'assets/images/companies/Untitled-design-68.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/10/Untitled-design-69.png',
     'assets/images/companies/Untitled-design-69.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/cropped-android-chrome-512x512-2.png',
     'assets/images/companies/cropped-android-chrome-512x512-2.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/10.png',
     'assets/images/distributions/10.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/2.png',
     'assets/images/distributions/2.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/08/3.1-1.png',
     'assets/images/distributions/3.1-1.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/08/4-1.png',
     'assets/images/distributions/4-1.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/5.png',
     'assets/images/distributions/5.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/6.png',
     'assets/images/distributions/6.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/arg-logo-white-since-19998.png',
     'assets/images/logo/arg-logo-white-since-19998.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/cropped-android-chrome-512x512-2.png',
     'assets/images/logo/cropped-android-chrome-512x512-2.png'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/1-1.webp',
     'assets/images/people/1-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/2-1.webp',
     'assets/images/people/2-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/27788581_1841168602621157_6185155260942098875_o-e1672326580166-1.webp',
     'assets/images/people/27788581_1841168602621157_6185155260942098875_o-e1672326580166-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/27788830_1841068002631217_7409809263613166531_o-1-1-e1672326461621-1.webp',
     'assets/images/people/27788830_1841068002631217_7409809263613166531_o-1-1-e1672326461621-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/3-1.webp',
     'assets/images/people/3-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/4-1.webp',
     'assets/images/people/4-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/5-1.webp',
     'assets/images/people/5-1.webp'),
    ('https://www.arg.lk/wp-content/uploads/2024/07/6-1.webp',
     'assets/images/people/6-1.webp'),
]

HERE = os.path.dirname(os.path.abspath(__file__))
ok = skipped = 0
failed = []
for remote, local in IMAGES:
    dest = os.path.join(HERE, local)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        skipped += 1
        continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(remote, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
            f.write(r.read())
        ok += 1
        print("downloaded", local)
    except Exception as e:
        failed.append((remote, str(e)))
        print("FAILED    ", local, "-", e)

print("\nDone: %d downloaded, %d already there, %d failed (of %d)." % (ok, skipped, len(failed), len(IMAGES)))
sys.exit(1 if failed else 0)
