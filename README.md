# iOS Simulator dla React Native

Symulator iOS do testowania kodu React Native w przeglądarce, oparty na Expo Snack.

## Funkcje

- Edycja kodu React Native w przeglądarce
- Podgląd aplikacji w symulatorze iOS
- Generowanie kodu QR do testowania na urządzeniach mobilnych
- Łatwe udostępnianie kodu poprzez link do Expo Snack

## Uruchomienie

1. Sklonuj repozytorium
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom backend (port 3000):
   ```bash
   cd ../hyper-build-backand
   npm install
   node app.js
   ```
4. Uruchom frontend (port 5173):
   ```bash
   cd ../hyper-build-designer
   npm start
   ```

## Rozwiązanie problemu CORS

Symulator używa Expo Snack do kompilacji kodu React Native. Ze względu na ograniczenia bezpieczeństwa przeglądarek (CORS), osadzenie bezpośrednio iframe z Expo Snack może nie działać.

### Opcja 1: Backend jako proxy (domyślnie)

Domyślna i najlepsza opcja to wykorzystanie backendeu Hyper Build jako proxy (port 3000). 
**Backend musi być uruchomiony** przed rozpoczęciem korzystania z symulatora.

1. Upewnij się, że backend jest uruchomiony:
   ```bash
   cd ../hyper-build-backand
   node app.js
   ```

2. Backend automatycznie udostępnia proxy pod adresem:
   ```
   http://localhost:3000/api/expo-proxy
   ```

3. Symulator jest skonfigurowany tak, aby domyślnie korzystać z backendu jako proxy.

### Opcja 2: Użycie przycisków awaryjnych

Jeśli napotkasz komunikat o błędzie CORS, możesz:
- Kliknąć "Otwórz podgląd w nowej karcie", aby zobaczyć wynik w pełnym edytorze Expo
- Kliknąć "Otwórz w Expo Snack", aby edytować kod w pełnym edytorze Expo

### Opcja 3: Uruchomienie oddzielnego serwera proxy

Jeśli z jakiegoś powodu nie możesz używać backendu Hyper Build, możesz uruchomić oddzielny serwer proxy:

1. Zainstaluj wymagane pakiety:
   ```bash
   npm install express http-proxy-middleware cors
   ```

2. Uruchom serwer proxy:
   ```bash
   node proxy-server.js
   ```

3. Serwer proxy będzie dostępny pod adresem:
   ```
   http://localhost:3001/expo-proxy
   ```

4. W symulatorze wybierz opcję "Lokalny serwer proxy (port 3001)" z rozwijanej listy.

## Deployment

### Na serwerze produkcyjnym

1. Zintegruj funkcjonalność proxy z backendem Twojej aplikacji.
2. Skonfiguruj odpowiednie nagłówki CORS na serwerze.
3. Dostosuj URL w funkcji `generatePreviewUrl()` do Twojego środowiska produkcyjnego:
   ```javascript
   const generatePreviewUrl = () => {
     return `https://twoj-backend.com/api/expo-proxy/embedded?preview=true&platform=ios&code=${encodeURIComponent(userCode)}`;
   };
   ```

## Autorzy

- Hyper Build Team

## Licencja

MIT
