import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
  input,
  model,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ApiStaticDataService } from '@app/_core/services/api-static-data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent implements OnInit, OnChanges {
  private apiStaticDataService = inject(ApiStaticDataService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  checked = model(false);
  checked$ = toObservable(this.checked);
  reason: Signal<[{ [key: string]: any }]> = toSignal(this.apiStaticDataService.getDeletionReasons());
  test = input(false);
  computedChecked = computed(() => this.handleCheckedChange(this.checked()));

  constructor() {
    effect(() => {
      console.log('checked', this.checked(), this.test());
    }, {});
    this.checked$.pipe(untilDestroyed(this)).subscribe((val) => {
      this.handleCheckedChange(val);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['checked']) {
      console.log('checked input changed');

      // Manually trigger change detection when `checked` input changes
      // this.changeDetectorRef.markForCheck();
    }
  }

  ngOnInit(): void {}

  handleCheckedChange(value: boolean) {
    console.log('handleCheckedChange', value);
  }

  trackByReason(item: any): void {
    return item.navigateTo;
  }
}
