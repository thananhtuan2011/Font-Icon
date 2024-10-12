import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ApiConfigurationService } from '@app/_core/services/api-configuration.service';

@Injectable()
@Pipe({ name: 'currencyLabel' })
export class CurrencyLabelPipe implements PipeTransform {
  private pointSign = {
    decimalSeparate: '',
    thousandsSeparate: '',
    postfixCurrency: ''
  };

  private amountSign = {
    decimalSeparate: '',
    thousandsSeparate: '',
    postfixCurrency: 'VND'
  };

  constructor(private apiConfigurationService: ApiConfigurationService) {
    this.pointSign.decimalSeparate = this.apiConfigurationService.decimalSign('point');
    this.pointSign.thousandsSeparate = this.apiConfigurationService.thousandSign('point');

    this.amountSign.decimalSeparate = this.apiConfigurationService.decimalSign('amount');
    this.amountSign.thousandsSeparate = this.apiConfigurationService.thousandSign('amount');
    this.amountSign.postfixCurrency = this.apiConfigurationService.currencySign('amount');
  }

  transform(
    value: number,
    symbol: any = null,
    fixed: any = 2,
    decimalDelimiter: string = ',',
    thousandsDelimiter: string | null = '.',
    currency: any = false
  ): any {
    if (!value || value === 0) return '0';

    const signConfig = currency ? this.amountSign : this.pointSign;
    const decimalSeparate = signConfig?.decimalSeparate ?? decimalDelimiter;
    const thousandsSeparate = signConfig?.thousandsSeparate ?? thousandsDelimiter;

    const roundValue = value.toFixed(Math.max(0, ~~fixed));
    let valueToReturn = roundValue.replace('.', decimalSeparate);

    if (thousandsSeparate)
      valueToReturn = this.setThousandsSign(valueToReturn, decimalSeparate, thousandsSeparate, fixed);

    valueToReturn = symbol ? symbol + valueToReturn : valueToReturn;
    valueToReturn = currency ? valueToReturn + ' ' + signConfig.postfixCurrency : valueToReturn;
    return valueToReturn;
  }

  private setThousandsSign(value: string, decimalDelimiter: string, thousandsDelimiter: string, fixed: any): string {
    const arrayValue = value.split(decimalDelimiter);

    let _textValue = '';

    const _value: string = arrayValue[0]
      .split('')
      .reverse()
      .map((str, index) => {
        return index % 3 === 0 ? str + thousandsDelimiter : str;
      })
      .reverse()
      .join('');

    const _arrText: any = _value.split('');

    const checkValue: any = _arrText[_arrText.length - 1] == thousandsDelimiter ? true : false;

    if (checkValue) {
      _arrText[_arrText.length - 1] = '';
      _textValue = _arrText.join('');
    } else {
      _textValue = _value;
    }

    return arrayValue[1] ? _textValue + decimalDelimiter + arrayValue[1] : _textValue;
  }
}
