import { AbstractControl } from '@angular/forms';
import {Observable, Observer, of} from 'rxjs';


export const mimeType = (control: AbstractControl):
Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

  if (typeof(control.value) === 'string') {
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const observableFile = new Observable((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      for (const elem of arr) {
        header += elem.toString(16);
      }
      let isValid = false;
      switch (header) {
        case '89504e47':
          isValid = true; // jpeg
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true; // png
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return observableFile;
};
