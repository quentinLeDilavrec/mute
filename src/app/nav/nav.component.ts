import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

import { ProfileService } from '../core/profile/profile.service'

import { AbstractStorageService } from 'core/AbstractStorageService'
import { StorageManagerService } from 'core/storage-manager/storage-manager.service'

@Component({
  selector: 'mute-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  private router: Router
  private profileService: ProfileService
  private storageManager: StorageManagerService

  @ViewChild('pseudonymElm') pseudonymElm
  pseudonym: string

  constructor (
    router: Router,
    profileService: ProfileService,
    storageManager: StorageManagerService
  ) {
    this.router = router
    this.profileService = profileService
    this.storageManager = storageManager
  }

  ngOnInit () {
    this.pseudonymElm.value = this.profileService.pseudonym
  }

  updatePseudonym (event) {
    this.profileService.pseudonym = event.target.value
    if (event.target.value === '') {
      this.pseudonymElm.value = this.profileService.pseudonym
    }
  }

  getStorageServices (): AbstractStorageService[] {
    return this.storageManager.getStorageServices()
  }

  setCurrentStorageService (storageService: AbstractStorageService) {
    this.storageManager.setCurrentStorageService(storageService)
  }

  newDoc () {
    const MIN_LENGTH = 10
    const DELTA_LENGTH = 0
    const MASK = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = ''
    const length = MIN_LENGTH + Math.round(Math.random() * DELTA_LENGTH)

    for (let i = 0; i < length; i++) {
      key += MASK[Math.round(Math.random() * (MASK.length - 1))]
    }
    this.router.navigate(['doc/' + key])
  }
}