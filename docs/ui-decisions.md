# Dziennik interwałów · brief iteracji 2

Jedno dotknięcie zamyka interwał. Drugi scenariusz to odczyt dzisiejszych czasów i notatek. Zmiany obejmują prezentację, przy zachowaniu znaczenia istniejących przycisków i danych.

| Decyzja | Rekomendacja i podstawa | Rodzaj | Pewność |
|---|---|---|---|
| Cele dotykowe | Tagi od 48 × 48 CSS px, odstęp 8 px, główna akcja od 56 px. [Android](https://support.google.com/accessibility/android/answer/7101858) zaleca 48 dp i odstęp 8 dp. [WCAG 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) określa minimum 24 CSS px z wyjątkami. | FAKT dla WCAG, KONWENCJA dla wymiarów aplikacji | Wysoka dla 48/8, średnia dla 56 |
| Zasięg | [Parhi i in.](https://www.microsoft.com/en-us/research/publication/target-size-study-for-one-handed-thumb-use-on-small-touchscreen-devices/) uzyskali 9,2 mm dla pojedynczych trafień. [Bergström-Lehtovirta i Oulasvirta](https://www.netlab.tkk.fi/~oulasvir/pubs/paper2117.pdf) uzależniają zasięg od chwytu, dłoni i urządzenia. [Azenkot i Zhai](https://cris.technion.ac.il/en/publications/touch-behavior-with-different-postures-on-soft-smartphone-keyboar/) badali różnice trafień podczas pisania w różnych chwytach. | FAKT | Wysoka |
| Położenie | Szeroki „Koniec interwału” na dole daje swobodę wyboru miejsca dotknięcia — **moja ocena**. Pięć neutralnych tagów nad nim, bez przewijania w bok. Istniejący Stop zostaje przy stanie sesji. | KONWENCJA | Średnia |
| Hierarchia | Czas i historia na początku, eksport i backup w rozwijanych sekcjach. [Nielsen](https://www.nngroup.com/articles/progressive-disclosure/) proponuje odsłanianie opcji drugorzędnych na żądanie. Błąd zapisu i przypomnienie o kopii mają własne widoczne miejsce. | KONWENCJA | Wysoka |
| Historia | Data raz na grupę, godziny po lewej, długość po prawej, treść poniżej. [Few](https://mail.perceptualedge.com/images/Effective_Chart_Design.pdf) poleca układ tabelaryczny do odczytu wartości. [Tufte](https://www.edwardtufte.com/wp-content/uploads/2024/10/Citation-Classic-Current-Contents-Dec.14-1992.pdf) łączy gęstość z ułatwianiem porównań. [Material 1](https://m1.material.io/components/lists.html) to starsza specyfikacja z wariantem 60 dp dla dwóch linii. Około 60 CSS px dla krótkiego wpisu to konwencja projektowa. Wiersz rośnie wraz z treścią. | KONWENCJA | Średnia |
| Typografia | Systemowy krój, cyfry tabelaryczne. Przy bazie 16 px rozmiar/interlinia to 14/20 dla godzin, 16/22 dla treści, 20/24 dla nagłówków i 32/36 dla licznika. Rytm odstępów 4, 8, 12 i 16 px. Dobór do aplikacji to moja ocena na podstawie hierarchii list Material. | KONWENCJA | Średnia |
| Dotyk i klawiatura | Obrys podczas nacisku, wpis jako potwierdzenie. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action) opisuje przewijanie i pinch-zoom przy manipulation. Panel wraca do przepływu strony przez CSS przy fokusie notatki. [web.dev](https://web.dev/blog/viewport-units) rozróżnia dynamiczną wysokość okna i klawiaturę. Dolna krawędź uwzględnia [safe area](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env). Brak animacji również przy preferencji ograniczonego ruchu. | KONWENCJA | Średnia do próby z Gboard |

## Kolor

Motyw wynika z preferencji systemowej. [Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3) przypisuje kolorom role. [WCAG 1.4.1, 1.4.3 i 1.4.11](https://www.w3.org/TR/WCAG22/) wymaga dodatkowego sygnału obok koloru, kontrastu 4,5:1 dla zwykłego tekstu i 3:1 dla informacji potrzebnej do rozpoznania kontrolki lub stanu. FAKT, pewność wysoka. Konkretne kolory to KONWENCJA.

| Rola | Jasny | Ciemny |
|---|---|---|
| Tło / powierzchnia | #F3F5F1 / #FFFFFF | #101713 / #1B251F |
| Tekst / pomocniczy na powierzchni | #17251E (15,91:1) / #4E6055 (6,71:1) | #F4F8F5 (14,72:1) / #B8C9BD (9,11:1) |
| Tekst / tło głównego przycisku | #FFFFFF / #146348 (7,22:1) | #102C1E / #8FE0B6 (9,64:1) |
| Obwódka na powierzchni | #68786E (4,67:1) | #617367 (3,12:1) |

Przyciski tagów są neutralne. Wyłącznie małe etykiety w historii korzystają z [Okabe–Ito](https://jfly.uni-koeln.de/color/), zawsze z nazwą. Kontrast czarnego tekstu wynosi dla scroll #56B4E9 9,10:1, gra #CC79A7 6,86:1, posiłek #E69F00 9,32:1, drzemka #009E73 6,14:1, przerwa #D55E00 5,43:1.

## Wzorce i rozbieżności

[Samsung Clock](https://images.samsung.com/is/content/samsung/p5/ca/support/mobile-devices/galaxy-s9-plus-how-do-i-access-the-user-manual-on-my-samsung-galaxy-s9-plus/pdf/SM-G96X_UG_EN4.pdf) rozdziela międzyczas i Stop. [Toggl](https://support.toggl.com/en-us/article/toggl-track-timer-for-android-1v3i5g8/) uruchamia pomiar z dolnej części listy. [Clockify](https://clockify.me/help/apps/android-app) udostępnia przerwę jako osobną akcję widżetu. [Strava](https://support.strava.com/en-us/articles/15402137-how-do-i-record-an-activity-on-strava) umieszcza Start przy dolnej krawędzi. Przeniesienie wzorców do dziennika to KONWENCJA, pewność średnia.

Minimum WCAG, zalecenie Androida i pomiar w milimetrach mają różne cele i jednostki. Dla częstych trafień przyjmujemy większe cele. Odrzucone warianty to pozioma karuzela tagów (wymaga gestu), wibracja (wychodzi poza zmianę wizualną) i osobna karta dla każdej daty powtarzanej przy wpisie (zajmuje miejsce).

## Testy ręczne

- [ ] **Realme 8 5G, Chrome, jedna ręka.** Uruchom sesję z historią dłuższą niż ekran. Przewiń do starszego wpisu. Dotknij kolejno scroll, gra, posiłek, drzemka i przerwa, za każdym razem zaczynając przy starszym wpisie. Każdy tag ma jednym dotknięciem zamknąć dokładnie jeden interwał i rozpocząć następny. Sprawdź pięć nowych wpisów i ich etykiety.
- [ ] **Realme 8 5G, Gboard.** Otwórz starszy wpis i dotknij notatki. Przy otwartej klawiaturze widać pole notatki i przycisk „Gotowe”. Panel szybkich akcji jest odpięty. Po „Gotowe” panel znów jest dostępny podczas przewijania.
- [ ] Sprawdź jasny i ciemny motyw, powiększony tekst, wpis przez północ oraz ręczne kopiowanie backupu z przypomnienia przy niedostępnym schowku.
