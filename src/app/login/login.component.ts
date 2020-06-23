import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/services';

@Component({ 
    templateUrl: 'login.component.html' 
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading: boolean = false;
    submitted:boolean = false;
    returnUrl: string;
    error:string = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService
    ){ 
        // check if user is logged in, then redirect to home
        if (this.authService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get fm() { 
        return this.loginForm.controls; 
    }

    onSubmit() {
        this.submitted = true;

        // return if form is invalid
        if (this.loginForm.invalid){
            return;
        }

        this.loading = true;
        this.authService.login(this.fm.email.value, this.fm.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
