import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCompressorComponent } from './img-compressor.component';

describe('ImgCompressorComponent', () => {
  let component: ImgCompressorComponent;
  let fixture: ComponentFixture<ImgCompressorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgCompressorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgCompressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
