import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal-content/modal-content.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  userDetails: Array<any> = [
   
  ]
  private commonDetails = {
    fname: ['', Validators.required],
    lname: ['', Validators.required],
    dob: ['', Validators.required],
    email: ['', Validators.email],
    mobile: ['', Validators.required],
    idType: ['aadhar', Validators.required],
    id: ['', Validators.required],
    address: this.fb.group({
      address1: ['', Validators.required],
      address2: '',
      address3: '',
    }),
    landmark: '',
    city: ['', Validators.required],
    state: ['', Validators.required]
  }

  registrationForm = this.fb.group({
    ...this.commonDetails,
    nominee: [false, Validators.required],
    nomineeDetails: this.fb.group({
      ...this.commonDetails,
    }),
    guardianDetails: this.fb.group({
      ...this.commonDetails,
    }),
  });


  get f(): { [key: string]: AbstractControl } {
    return this.registrationForm.controls;
  }

  param: any = {
    'f': this.f,
    'submitted': false,
    'type': 'normal',
    'form': this.registrationForm,
    'nominee': true,
  }
  nomineeParam: any = {
    'f': this.f,
    'submitted': false,
    'type': 'nominee',
    'form': this.registrationForm.controls['nomineeDetails'],
  }
  guardianParam: any = {
    'f': this.f,
    'type': 'guardian',
    'submitted': false,
    'form': this.registrationForm.controls['guardianDetails']
  }

  private dobSubscription: any
  needGuardian: boolean = false

  constructor(private fb: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    const nomineeDetails = this.registrationForm.get('nomineeDetails') as FormGroup;
    const guardianDetails = this.registrationForm.get('guardianDetails') as FormGroup;

    updateFormControl(nomineeDetails, false)
    updateFormControl(guardianDetails, false)

    this.registrationForm.get('nominee')?.valueChanges.subscribe(value => {
      updateFormControl(nomineeDetails, value ? true : false)

      if (value) {
        this.dobSubscription = this.registrationForm.get('nomineeDetails')?.get('dob')?.valueChanges.subscribe(dob => {
          if (dob) {
            this.needGuardian = caluclateAge(dob) < 18
            updateFormControl(guardianDetails, this.needGuardian)
          }

        });
      } else {
        if (this.dobSubscription)
          this.dobSubscription.unsubscribe()
      }

     
      function caluclateAge(dateOfBirth: string) {
        let dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();

        if (
          today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        return age
      }
    });
    function updateFormControl(form: FormGroup, value: boolean | null) {
     
      for (let key in form.controls) {
        const control = form.get(key)!;

        if (value) {
          if (['fname', 'lname', 'dob', 'mobile', 'id', 'city', 'state'].includes(key)) {
            control.setValidators([Validators.required]);
          } else if (key === 'idType') {
            control.setValidators([Validators.required]);
            control.setValue('aadhar')
          } else if (key === 'address') {
            const address = form.get(key) as FormGroup
            address.get('address1')?.setValidators([Validators.required]);
          }
        } else {
          if (key === 'address') {
            const addrKey = control.get('address1')!
            addrKey.clearValidators();
            addrKey.updateValueAndValidity();
          } else
            control.clearValidators();
        }
        control.updateValueAndValidity();
      }

    }
  }

  openPopup(content: any,type:string) {
    const modalRef = this.modalService.open(ModalContentComponent);
    modalRef.componentInstance.obj = content
    modalRef.componentInstance.type = type
  }

  onSubmit() {
    this.param['submitted'] = true
    this.nomineeParam['submitted'] = true
    this.guardianParam['submitted'] = true
    if (this.registrationForm.valid) {
      this.userDetails.push(this.registrationForm.value)
      this.param['submitted'] = false
      this.nomineeParam['submitted'] = false
      this.guardianParam['submitted'] = false
      this.needGuardian = false
      this.registrationForm.reset()
      this.registrationForm.patchValue({
        idType: 'aadhar',
        nominee: false
      });
    }
    console.log(this.registrationForm.value);
  }
}
