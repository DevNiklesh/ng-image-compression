import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImgCompressorComponent } from './img-compressor/img-compressor.component';

const routes: Routes = [{ path: '', component: ImgCompressorComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
