import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatCarouselSlideComponent } from '@ngmodule/material-carousel';
import { CategoryService } from '../../services/category/category.service';
import { CategoryModel } from '../../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  slides = new Array<never>(8);
  categories: CategoryModel[];

  @ViewChildren(MatCarouselSlideComponent) public carouselSlides: QueryList<MatCarouselSlideComponent>;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories: CategoryModel[]) => {
      this.categories = categories;
    });
  }
}
