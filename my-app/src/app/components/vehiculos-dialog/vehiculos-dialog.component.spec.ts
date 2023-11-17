import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculosDialogComponent } from './vehiculos-dialog.component';

describe('VehiculosDialogComponent', () => {
  let component: VehiculosDialogComponent;
  let fixture: ComponentFixture<VehiculosDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiculosDialogComponent]
    });
    fixture = TestBed.createComponent(VehiculosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
