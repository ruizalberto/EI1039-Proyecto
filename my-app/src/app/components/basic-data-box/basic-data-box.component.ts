import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'basic-data-box',
    templateUrl: './basic-data-box.component.html',
    styleUrls: ['./basic-data-box.component.css'],
})
export class BasicDataBox implements OnInit {
    @Input() title!: string;
    @Input() actionBtn!: string;
    @Input() isBtn: boolean = false;
    @Output() actionBtnTap = new EventEmitter();
    @Output() helpBtnTap = new EventEmitter();

    constructor() { }

    ngOnInit(): void { }

    onSeeMoreTap() {
        this.actionBtnTap.emit();
    }

    onHelpTap() {
        this.helpBtnTap.emit();
    }
}