import { Component, OnInit } from '@angular/core';
import { Restaurant } from './restaurant/restaurant.model';
import { RestaurantService } from './restaurants.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable, from } from 'rxjs';
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
  animations: [
    trigger('toggleSearch', [
      state('hidden', style({
        opacity: 0,
        'max-height': '0px'
      })),
      state('visible', style({
        opacity: 1,
        'max-height': '70px',
        'margin-top': '20px'
      })),
      transition('* => *', animate('250ms 0s ease-in-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  searchbarState = 'hidden';
  restaurants: Restaurant[];

  searchForm: FormGroup;
  searchControl: FormControl;

  constructor(private restaurantsService: RestaurantService,
              private fb: FormBuilder) { }

  ngOnInit() {

    this.searchControl = this.fb.control('');
    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    });

    this.searchControl.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap( searchTerm => this.restaurantsService
        .restaurants(searchTerm)
        .pipe(catchError(error => from([])) ))
    )
     .subscribe( restaurants => this.restaurants = restaurants );
 //   this.restaurants = this.restaurantsService.restaurants();
    this.restaurantsService.restaurants().subscribe(restaurants => this.restaurants = restaurants);
  }

  toggleSearch() {
    this.searchbarState = this.searchbarState === 'hidden' ? 'visible' : 'hidden';
  }

}
