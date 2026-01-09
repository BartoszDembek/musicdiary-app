# Music Diary App

## Testing

### UI Tests (Unit/Integration)
Run the following command to execute Jest tests:
```bash
npm test
```

### E2E Tests (Maestro)
1. Install Maestro: https://maestro.mobile.dev/
2. Start your app in an emulator/simulator (Android or iOS).
   ```bash
   npm run android
   # or
   npm run ios
   ```
3. Run the flow:
   ```bash
   maestro test e2e/login_flow.yaml
   ```
