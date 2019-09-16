import { Component, OnInit } from '@angular/core';
import { CategoryService } from './services/category/category.service';
import { CategoryModel } from './models/category.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  categories: CategoryModel[];

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories: CategoryModel[]) => {
      this.categories = categories;
    });
  }
}
