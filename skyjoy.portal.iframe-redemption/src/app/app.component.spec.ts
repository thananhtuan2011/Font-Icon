import { TestBed } from '@angular/core/testing';
import { ComponentInjection, NewComponentInjection, TestingModules, TestingProviders } from './_testing';
import { AppComponent } from './app.component';
import { SentryLoggerModule } from './_share/modules/sentry-logger/sentry-logger.module';

describe('AppComponent', () => {
  // let component: AppComponent;
  let componentInjector: ComponentInjection<AppComponent>;
  // let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, ...TestingModules, SentryLoggerModule],
      providers: [...TestingProviders]
    }).compileComponents();

    componentInjector = NewComponentInjection(AppComponent);
    // fixture = TestBed.createComponent(AppComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(componentInjector.component).toBeTruthy();
  });
});
