import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent {
  @Input() obj: any;
  @Input() type!: string;
  active = 'nomineeDetails';

  ngOnInit() {
    
    console.log(this.obj);
  }
  ngOnChanges(){
  console.log(this.obj);

  }
 
}
