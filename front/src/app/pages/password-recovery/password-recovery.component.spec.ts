import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryComponentPage } from './password-recovery.component';

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponentPage;
  let fixture: ComponentFixture<PasswordRecoveryComponentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryComponentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
