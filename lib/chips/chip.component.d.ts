import { ChangeDetectorRef, EventEmitter, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { IDisplayDensityOptions, DisplayDensityBase } from '../core/displayDensity';
import { IgxDragDirective, IDragBaseEventArgs, IDragStartEventArgs, IDropBaseEventArgs, IDropDroppedEventArgs } from '../directives/drag-drop/drag-drop.directive';
import { IBaseEventArgs } from '../core/utils';
import { IChipResourceStrings } from '../core/i18n/chip-resources';
import * as i0 from "@angular/core";
export interface IBaseChipEventArgs extends IBaseEventArgs {
    originalEvent: IDragBaseEventArgs | IDropBaseEventArgs | KeyboardEvent | MouseEvent | TouchEvent;
    owner: IgxChipComponent;
}
export interface IChipClickEventArgs extends IBaseChipEventArgs {
    cancel: boolean;
}
export interface IChipKeyDownEventArgs extends IBaseChipEventArgs {
    originalEvent: KeyboardEvent;
    cancel: boolean;
}
export interface IChipEnterDragAreaEventArgs extends IBaseChipEventArgs {
    dragChip: IgxChipComponent;
}
export interface IChipSelectEventArgs extends IBaseChipEventArgs {
    cancel: boolean;
    selected: boolean;
}
/**
 * Chip is compact visual component that displays information in an obround.
 *
 * @igxModule IgxChipsModule
 *
 * @igxTheme igx-chip-theme
 *
 * @igxKeywords chip
 *
 * @igxGroup display
 *
 * @remarks
 * The Ignite UI Chip can be templated, deleted, and selected.
 * Multiple chips can be reordered and visually connected to each other.
 * Chips reside in a container called chips area which is responsible for managing the interactions between the chips.
 *
 * @example
 * ```html
 * <igx-chip class="chipStyle" [id]="901" [draggable]="true" [removable]="true" (remove)="chipRemoved($event)">
 *    <igx-avatar class="chip-avatar-resized" igxPrefix [roundShape]="true"></igx-avatar>
 * </igx-chip>
 * ```
 */
export declare class IgxChipComponent extends DisplayDensityBase {
    cdr: ChangeDetectorRef;
    private ref;
    private renderer;
    protected _displayDensityOptions: IDisplayDensityOptions;
    /**
     * An @Input property that sets the value of `id` attribute. If not provided it will be automatically generated.
     *
     * @example
     * ```html
     * <igx-chip [id]="'igx-chip-1'"></igx-chip>
     * ```
     */
    id: string;
    /**
     * Returns the `role` attribute of the chip.
     *
     * @example
     * ```typescript
     * let chipRole = this.chip.role;
     * ```
     */
    role: string;
    /**
     * An @Input property that sets the value of `tabindex` attribute. If not provided it will use the element's tabindex if set.
     *
     * @example
     * ```html
     * <igx-chip [id]="'igx-chip-1'" [tabIndex]="1"></igx-chip>
     * ```
     */
    set tabIndex(value: number);
    get tabIndex(): number;
    /**
     * An @Input property that stores data related to the chip.
     *
     * @example
     * ```html
     * <igx-chip [data]="{ value: 'Country' }"></igx-chip>
     * ```
     */
    data: any;
    /**
     * An @Input property that defines if the `IgxChipComponent` can be dragged in order to change it's position.
     * By default it is set to false.
     *
     * @example
     * ```html
     * <igx-chip [id]="'igx-chip-1'" [draggable]="true"></igx-chip>
     * ```
     */
    draggable: boolean;
    /**
     * An @Input property that enables/disables the draggable element animation when the element is released.
     * By default it's set to true.
     *
     * @example
     * ```html
     * <igx-chip [id]="'igx-chip-1'" [draggable]="true" [animateOnRelease]="false"></igx-chip>
     * ```
     */
    animateOnRelease: boolean;
    /**
     * An @Input property that enables/disables the hiding of the base element that has been dragged.
     * By default it's set to true.
     *
     * @example
     * ```html
     * <igx-chip [id]="'igx-chip-1'" [draggable]="true" [hideBaseOnDrag]="false"></igx-chip>
     * ```
     */
    hideBaseOnDrag: boolean;
    /**
     * An @Input property that defines if the `IgxChipComponent` should render remove button and throw remove events.
     * By default it is set to false.
     *
     * @example
     * ```html
     * <igx-chip [id]="'igx-chip-1'" [draggable]="true" [removable]="true"></igx-chip>
     * ```
     */
    removable: boolean;
    /**
     * An @Input property that overrides the default icon that the chip applies to the remove button.
     *
     * @example
     * ```html
     * <igx-chip [id]="chip.id" [removable]="true" [removeIcon]="iconTemplate"></igx-chip>
     * <ng-template #iconTemplate><igx-icon>delete</igx-icon></ng-template>
     * ```
     */
    removeIcon: TemplateRef<any>;
    /**
     * An @Input property that defines if the `IgxChipComponent` can be selected on click or through navigation,
     * By default it is set to false.
     *
     * @example
     * ```html
     * <igx-chip [id]="chip.id" [draggable]="true" [removable]="true" [selectable]="true"></igx-chip>
     * ```
     */
    selectable: boolean;
    /**
     * An @Input property that overrides the default icon that the chip applies when it is selected.
     *
     * @example
     * ```html
     * <igx-chip [id]="chip.id" [selectable]="true" [selectIcon]="iconTemplate"></igx-chip>
     * <ng-template #iconTemplate><igx-icon>done_outline</igx-icon></ng-template>
     * ```
     */
    selectIcon: TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    class: string;
    /**
     * An @Input property that defines if the `IgxChipComponent` is disabled. When disabled it restricts user interactions
     * like focusing on click or tab, selection on click or Space, dragging.
     * By default it is set to false.
     *
     * @example
     * ```html
     * <igx-chip [id]="chip.id" [disabled]="true"></igx-chip>
     * ```
     */
    disabled: boolean;
    /**
     * Sets the `IgxChipComponent` selected state.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [selectable]="true" [selected]="true">
     * ```
     *
     * Two-way data binding:
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [selectable]="true" [(selected)]="model.isSelected">
     * ```
     */
    set selected(newValue: boolean);
    /**
     * Returns if the `IgxChipComponent` is selected.
     *
     * @example
     * ```typescript
     * @ViewChild('myChip')
     * public chip: IgxChipComponent;
     * selectedChip(){
     *     let selectedChip = this.chip.selected;
     * }
     * ```
     */
    get selected(): boolean;
    /**
     * @hidden
     * @internal
     */
    selectedChange: EventEmitter<boolean>;
    /**
     * An @Input property that sets the `IgxChipComponent` background color.
     * The `color` property supports string, rgb, hex.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [color]="'#ff0000'"></igx-chip>
     * ```
     */
    set color(newColor: any);
    /**
     * Returns the background color of the `IgxChipComponent`.
     *
     * @example
     * ```typescript
     * @ViewChild('myChip')
     * public chip: IgxChipComponent;
     * ngAfterViewInit(){
     *     let chipColor = this.chip.color;
     * }
     * ```
     */
    get color(): any;
    /**
     * An accessor that sets the resource strings.
     * By default it uses EN resources.
     */
    set resourceStrings(value: IChipResourceStrings);
    /**
     * An accessor that returns the resource strings.
     */
    get resourceStrings(): IChipResourceStrings;
    /**
     * Emits an event when the `IgxChipComponent` moving starts.
     * Returns the moving `IgxChipComponent`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (moveStart)="moveStarted($event)">
     * ```
     */
    moveStart: EventEmitter<IBaseChipEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` moving ends.
     * Returns the moved `IgxChipComponent`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (moveEnd)="moveEnded($event)">
     * ```
     */
    moveEnd: EventEmitter<IBaseChipEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` is removed.
     * Returns the removed `IgxChipComponent`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (remove)="remove($event)">
     * ```
     */
    remove: EventEmitter<IBaseChipEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` is clicked.
     * Returns the clicked `IgxChipComponent`, whether the event should be canceled.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (click)="chipClick($event)">
     * ```
     */
    chipClick: EventEmitter<IChipClickEventArgs>;
    /**
     * Emits event when the `IgxChipComponent` is selected/deselected.
     * Returns the selected chip reference, whether the event should be canceled, what is the next selection state and
     * when the event is triggered by interaction `originalEvent` is provided, otherwise `originalEvent` is `null`.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [selectable]="true" (selectedChanging)="chipSelect($event)">
     * ```
     */
    selectedChanging: EventEmitter<IChipSelectEventArgs>;
    /**
     * Emits event when the `IgxChipComponent` is selected/deselected and any related animations and transitions also end.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [selectable]="true" (selectedChanged)="chipSelectEnd($event)">
     * ```
     */
    selectedChanged: EventEmitter<IBaseChipEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` keyboard navigation is being used.
     * Returns the focused/selected `IgxChipComponent`, whether the event should be canceled,
     * if the `alt`, `shift` or `control` key is pressed and the pressed key name.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (keyDown)="chipKeyDown($event)">
     * ```
     */
    keyDown: EventEmitter<IChipKeyDownEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` has entered the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragEnter)="chipEnter($event)">
     * ```
     */
    dragEnter: EventEmitter<IChipEnterDragAreaEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` has left the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragLeave)="chipLeave($event)">
     * ```
     */
    dragLeave: EventEmitter<IChipEnterDragAreaEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` is over the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragOver)="chipOver($event)">
     * ```
     */
    dragOver: EventEmitter<IChipEnterDragAreaEventArgs>;
    /**
     * Emits an event when the `IgxChipComponent` has been dropped in the `IgxChipsAreaComponent`.
     * Returns the target `IgxChipComponent`, the drag `IgxChipComponent`, as  well as
     * the original drop event arguments.
     *
     * @example
     * ```html
     * <igx-chip #myChip [id]="'igx-chip-1'" [draggable]="true" (dragDrop)="chipLeave($event)">
     * ```
     */
    dragDrop: EventEmitter<IChipEnterDragAreaEventArgs>;
    /**
     * @hidden
     * @internal
     */
    get hostClass(): string;
    /**
     * Property that contains a reference to the `IgxDragDirective` the `IgxChipComponent` uses for dragging behavior.
     *
     * @example
     * ```html
     * <igx-chip [id]="chip.id" [draggable]="true"></igx-chip>
     * ```
     * ```typescript
     * onMoveStart(event: IBaseChipEventArgs){
     *     let dragDirective = event.owner.dragDirective;
     * }
     * ```
     */
    dragDirective: IgxDragDirective;
    /**
     * @hidden
     * @internal
     */
    chipArea: ElementRef;
    /**
     * @hidden
     * @internal
     */
    selectContainer: ElementRef;
    /**
     * @hidden
     * @internal
     */
    defaultRemoveIcon: TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    defaultSelectIcon: TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    get removeButtonTemplate(): TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    get selectIconTemplate(): TemplateRef<any>;
    /**
     * @hidden
     * @internal
     */
    get ghostClass(): string;
    /** @hidden @internal */
    get nativeElement(): HTMLElement;
    /**
     * @hidden
     * @internal
     */
    hideBaseElement: boolean;
    protected _tabIndex: any;
    protected _selected: boolean;
    protected _selectedItemClass: string;
    protected _movedWhileRemoving: boolean;
    private _resourceStrings;
    constructor(cdr: ChangeDetectorRef, ref: ElementRef<HTMLElement>, renderer: Renderer2, _displayDensityOptions: IDisplayDensityOptions);
    /**
     * @hidden
     * @internal
     */
    keyEvent(event: KeyboardEvent): void;
    /**
     * @hidden
     * @internal
     */
    selectClass(condition: boolean): any;
    onSelectTransitionDone(event: any): void;
    /**
     * @hidden
     * @internal
     */
    onChipKeyDown(event: KeyboardEvent): void;
    /**
     * @hidden
     * @internal
     */
    onRemoveBtnKeyDown(event: KeyboardEvent): void;
    onRemoveMouseDown(event: PointerEvent | MouseEvent): void;
    /**
     * @hidden
     * @internal
     */
    onRemoveClick(event: MouseEvent | TouchEvent): void;
    /**
     * @hidden
     * @internal
     */
    onRemoveTouchMove(): void;
    /**
     * @hidden
     * @internal
     */
    onRemoveTouchEnd(event: TouchEvent): void;
    /**
     * @hidden
     * @internal
     */
    onChipDragStart(event: IDragStartEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onChipDragEnd(): void;
    /**
     * @hidden
     * @internal
     */
    onChipMoveEnd(event: IDragBaseEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onChipGhostCreate(): void;
    /**
     * @hidden
     * @internal
     */
    onChipGhostDestroy(): void;
    /**
     * @hidden
     * @internal
     */
    onChipDragClicked(event: IDragBaseEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onChipDragEnterHandler(event: IDropBaseEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onChipDragLeaveHandler(event: IDropBaseEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onChipDrop(event: IDropDroppedEventArgs): void;
    /**
     * @hidden
     * @internal
     */
    onChipOverHandler(event: IDropBaseEventArgs): void;
    protected changeSelection(newValue: boolean, srcEvent?: any): void;
    static ??fac: i0.????FactoryDeclaration<IgxChipComponent, [null, null, null, { optional: true; }]>;
    static ??cmp: i0.????ComponentDeclaration<IgxChipComponent, "igx-chip", never, { "id": "id"; "tabIndex": "tabIndex"; "data": "data"; "draggable": "draggable"; "animateOnRelease": "animateOnRelease"; "hideBaseOnDrag": "hideBaseOnDrag"; "removable": "removable"; "removeIcon": "removeIcon"; "selectable": "selectable"; "selectIcon": "selectIcon"; "class": "class"; "disabled": "disabled"; "selected": "selected"; "color": "color"; "resourceStrings": "resourceStrings"; }, { "selectedChange": "selectedChange"; "moveStart": "moveStart"; "moveEnd": "moveEnd"; "remove": "remove"; "chipClick": "chipClick"; "selectedChanging": "selectedChanging"; "selectedChanged": "selectedChanged"; "keyDown": "keyDown"; "dragEnter": "dragEnter"; "dragLeave": "dragLeave"; "dragOver": "dragOver"; "dragDrop": "dragDrop"; }, never, ["igx-prefix,[igxPrefix]", "*", "igx-suffix,[igxSuffix]"]>;
}
