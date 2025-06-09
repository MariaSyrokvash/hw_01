import { app } from './app';
import { CONFIG } from './config';

app.listen(CONFIG.PORT, () => {
  console.log('...server started in port ' + CONFIG.PORT);
});
