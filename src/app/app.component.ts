import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  markers = [];
  markersConfirm = [];
  markerRec = 0;

  isStarted = false;
  isRecPASS = false;

  errState = 1;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode == 32) this.myEvent()
  }

  ngOnInit() {
    let item = localStorage.getItem("errState")
    this.errState = +item || 0;
  }

  async startRec() {
    this.isStarted = true;

    this.markersConfirm = [];
    this.markers = [];
    this.markerRec = 0

    for (let i = 0; i < 100; i++) {
      const new_i = await this.timeout(i);
      this.markerRec = new_i

      if (!this.isStarted) break;
    }

    this.isStarted = false;

    if (this.isRecPASS) this.saveKey()
    else this.confirmPass()
  }

  timeout(i) {
    return new Promise<number>((resolve) =>
      setTimeout(() => resolve(i), 100))
  }

  confirmPass() {
    const err = this.errState;

    let items: any = localStorage.getItem("myPASSWORD");
    if (items) items = JSON.parse(items);
    else return;

    console.log('------------------------')
    console.log('origin:', items)
    console.log('user:', this.markersConfirm)

    if (items.length != this.markersConfirm.length) {
      alert('ERROR!!')
      return
    }

    let result = 0

    items.forEach((a, i) => {
      const b = this.markersConfirm[i]
      if (a >= b - err && a <= b + err)
        result++;
    });

    if (items.length == result) alert('SUCCESS !!!');
    else alert('ERROR!!');
  }

  saveErrState(e) {
    this.errState = e
    localStorage.setItem("errState", e)
  }

  myEvent() {
    if (this.isRecPASS) this.addMarkerForRec()
    else this.addMarkerForConfirm()
  }

  addMarkerForConfirm() {
    if (!this.isStarted) this.startRec()
    this.markersConfirm.push(this.markerRec)
  }

  addMarkerForRec() {
    if (!this.isStarted) this.startRec()
    this.markers.push(this.markerRec)
  }

  saveKey() {
    localStorage.setItem("myPASSWORD", JSON.stringify(this.markers))
  }
}
