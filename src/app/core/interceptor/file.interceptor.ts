import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, tap} from "rxjs";


@Injectable()
export class FileInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const contentDispositionHeader = req.headers.get('Content-Disposition');


    if (contentDispositionHeader) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const filenameMatch = filenameRegex.exec(contentDispositionHeader);
      const filename = filenameMatch && filenameMatch[1];

      const fileExtension = filename ? filename.split('.').pop() : '';

      let acceptHeader = '';
      switch (fileExtension?.toLowerCase()) {
        case 'pdf':
          acceptHeader = 'application/pdf';
          break;
        case 'xls':
          acceptHeader = 'application/vnd.ms-excel';
          break;
        case 'xlsx':
          acceptHeader = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'doc':
        case 'docx':
          acceptHeader = 'application/msword';
          break;
        default:
          break;
      }

        if (acceptHeader) {
          req = req.clone({
            setHeaders: {
              Accept: acceptHeader,
            },
            responseType: 'blob',
          });

          return next.handle(req);
        }
    }
    return next.handle(req);
  }

 }
