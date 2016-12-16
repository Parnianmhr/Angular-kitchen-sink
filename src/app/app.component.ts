import {Component, ViewContainerRef, forwardRef, Inject} from '@angular/core';
import {Ngmslib} from "ng-mslib";
import {ToastsManager, ToastOptions} from "ng2-toastr";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Http} from "@angular/http";
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs";
import {LocalStorage} from "../services/LocalStorage";
import {AppStore} from "angular2-redux-util";
import {AppdbAction} from "../actions/AppdbAction";
import {CommBroker} from "../services/CommBroker";
import {StyleService} from "../styles/StyleService";
import {Consts} from "../Conts";
import {VERSION} from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [StyleService, AppdbAction],
})
export class AppComponent {
    constructor(private appStore:AppStore,
                private commBroker: CommBroker,
                private styleService: StyleService,
                private http: Http,
                private toastr: ToastsManager,
                private vRef: ViewContainerRef, 
                private appdbAction:AppdbAction,
                private localStorage: LocalStorage) {

        Ngmslib.GlobalizeStringJS();
        this.kitchenSink = '4.68';
        this.ngVersion = VERSION.full

        this.toastr.setRootViewContainerRef(vRef);
        console.log(StringJS('string-js-is-init').humanize().s);
        // this.appStore.dispatch(appdbAction.appStartTime());
        this.commBroker.setService(Consts.Services().App, this);
        Observable.fromEvent(window, 'resize').debounceTime(250).subscribe(() => {
            this.appResized();
        });

    }

    private kitchenSink:string;
    private ngVersion:string;

    /**
     On application resize deal with height changes
     @method appResized
     **/
    public appResized(): void {
        var appHeight = document.body.clientHeight;
        var appWidth = document.body.clientWidth;
        //console.log('resized ' + appHeight);
        jQuery(Consts.Elems().APP_NAVIGATOR_EVER).height(appHeight - 115);
        jQuery(Consts.Elems().APP_NAVIGATOR_WASP).height(appHeight - 115);
        jQuery(Consts.Clas().CLASS_APP_HEIGHT).height(appHeight - 420);
        jQuery('#mainPanelWrap').height(appHeight - 115);
        jQuery('#propPanel').height(appHeight - 130);

        this.commBroker.setValue(Consts.Values().APP_SIZE, {
            height: appHeight,
            width: appWidth
        });
        this.commBroker.fire({
            fromInstance: self,
            event: Consts.Events().WIN_SIZED,
            context: '',
            message: {
                height: appHeight,
                width: appWidth
            }
        })
    }
}

