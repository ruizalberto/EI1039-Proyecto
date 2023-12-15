import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarCuentaDialogComponent } from './eliminar-cuenta-dialog.component';

describe('EliminarCuentaDialogComponent', () => {
  let component: EliminarCuentaDialogComponent;
  let fixture: ComponentFixture<EliminarCuentaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarCuentaDialogComponent]
    });
    fixture = TestBed.createComponent(EliminarCuentaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
