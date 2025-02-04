
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common'; // Import CommonModule

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
