import {Component, EventEmitter, forwardRef, HostListener, OnInit, Output} from '@angular/core';
import {ExpenseItemService} from "../../services/expense-item.service";
import {NgForOf, NgIf} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-category-options',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './category-options.component.html',
  styleUrl: './category-options.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryOptionsComponent),
      multi: true,
    },
  ],
})
export class CategoryOptionsComponent implements OnInit, ControlValueAccessor {
  @Output() categorySelected = new EventEmitter<string>();

  public categories: string[] = [];
  public filteredCategories: string[] = [];
  public inputValue: string = '';
  public showDropdown: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private expenseService: ExpenseItemService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.expenseService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  onInputChange(): void {
    const value = this.inputValue.toLowerCase();
    this.filteredCategories = this.categories.filter((category) =>
      category.toLowerCase().startsWith(value)
    );
    this.showDropdown = this.filteredCategories.length > 0;

    this.onChange(this.inputValue);
    this.categorySelected.emit(this.inputValue);
  }

  selectCategory(category: string): void {
    this.inputValue = category;
    this.showDropdown = false;
    this.onChange(this.inputValue);
    this.categorySelected.emit(this.inputValue);
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-selector')) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  writeValue(value: string): void {
    this.inputValue = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }
}
