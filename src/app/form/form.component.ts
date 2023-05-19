import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() param: any;
  restrictDate!: string;
 ismobileInvalid:boolean = false
  mobileValidation(event: KeyboardEvent) {
    const isDigit = /^\d$/.test(event.key);
    if (!isDigit) event.preventDefault();
  }
  mobileLength(count: number) {
    if (count && count < 10) this.ismobileInvalid = true
    else this.ismobileInvalid = false
  }

  ngOnInit() {
    if (this.param.type === 'nominee') {
      this.restrictDate = new Date().toISOString().substring(0, 10);
    } else {
      const today = new Date();
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      this.restrictDate = maxDate.toISOString().substring(0, 10);
    }
  }
}
