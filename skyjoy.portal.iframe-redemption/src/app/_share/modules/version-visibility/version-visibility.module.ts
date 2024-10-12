import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionVisibilityDirective } from '@app/_share/modules/version-visibility/version-visibility.directive';

@NgModule({
  declarations: [VersionVisibilityDirective],
  imports: [CommonModule],
  exports: [VersionVisibilityDirective],
  providers: [VersionVisibilityDirective]
})
export class VersionVisibilityModule {}
