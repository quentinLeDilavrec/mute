import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { ProfileService } from '../core/profile/profile.service'
import { BotStorageService } from '../core/bot-storage/bot-storage.service'

@Component({
  selector: 'mute-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  private route: ActivatedRoute
  private router: Router
  private profileService: ProfileService
  private botStorageService: BotStorageService
  private available: boolean
  private tooltipMsg: string

  @ViewChild('pseudonymElm') pseudonymElm
  pseudonym: string

  constructor (
    router: Router,
    route: ActivatedRoute,
    botStorageService: BotStorageService,
    profileService: ProfileService
  ) {
    this.router = router
    this.route = route
    this.botStorageService = botStorageService
    this.profileService = profileService
  }

  ngOnInit () {
    this.pseudonymElm.value = this.profileService.pseudonym
    this.botStorageService.reachable()
      .then(() => {
        this.available = true
        this.tooltipMsg = `Is available on: ${this.botStorageService.getURL()}`
      })
      .catch(() => {
        this.available = false
        this.tooltipMsg = `${this.botStorageService.getURL()} is not available`
      })
  }

  updatePseudonym (event) {
    this.profileService.pseudonym = event.target.value
    if (event.target.value === '') {
      this.pseudonymElm.value = this.profileService.pseudonym
    }
  }

  showTooltip () {

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
