import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { AnimatioDemoComponent } from '../animatio-demo/animatio-demo.component';

@Injectable({
    providedIn: 'root'
})
export class ComponentBuilderService {

    constructor(private resolver: ComponentFactoryResolver) {

    }

    open(vcr: ViewContainerRef, name?: string) {
        const winName = this.createUUID();
        // @ts-ignore
        const win = new fin.desktop.Window({
            url : 'http://localhost:4200/popup.html',
            autoShow: true,
            defaultWidth: 500,
            defaultHeight: 400,
            name : winName
        }, () => this.onWindowCreated(win,vcr), error => console.error(error));
    }
    private onWindowCreated(win: any, vcr: ViewContainerRef) {
        const factory = this.resolver.resolveComponentFactory(AnimatioDemoComponent);
        const component = vcr.createComponent(factory);    
        const doc = win.contentWindow.document;
        doc.body.appendChild(component.location.nativeElement);        
        setTimeout(() => {
            const styles = document.head.getElementsByTagName('style');        
            for (let i = 0; i < styles.length; i++) {
                const style = styles[i].cloneNode(true);
                doc.head.appendChild(style);
            }
        }, 0);
    }

    private createUUID(): string {
        return Math.floor(Math.random() * 1e6).toString();
    }
}
