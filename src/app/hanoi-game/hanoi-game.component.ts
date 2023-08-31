import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-hanoi-game',
  templateUrl: './hanoi-game.component.html',
  styleUrls: ['./hanoi-game.component.css'],
})
export class HanoiGameComponent implements OnInit {
  numberOfDiscs: number = 4;
  binaryCounter: number = 0;
  stepCounter: number = 0;
  prevBinaryString: string = '0'.repeat(this.numberOfDiscs);

  @ViewChild('binaryNumber', { static: false }) binaryNumber: ElementRef;
  @ViewChild('stepCounterElement') stepCounterElement: ElementRef;
  @ViewChild('nextStep') nextStep: ElementRef;
  @ViewChild('numberOfDiscsElement') numberOfDiscsElement: ElementRef;
  @ViewChild('tower1') tower1: ElementRef;
  @ViewChild('tower2') tower2: ElementRef;
  @ViewChild('tower3') tower3: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // Jetzt können Sie auf this.binaryNumber.nativeElement zugreifen
    console.log(this.binaryNumber.nativeElement);
    console.log(this.numberOfDiscsElement.nativeElement);
    this.resetGame();
  }

  incrementBinary(): string {
    this.binaryCounter++;
    const binaryString = this.binaryCounter
      .toString(2)
      .padStart(this.numberOfDiscs, '0');
    this.binaryNumber.nativeElement.innerText = binaryString;

    if (binaryString === '1'.repeat(this.numberOfDiscs)) {
      this.nextStep.nativeElement.disabled = true;
    }

    this.stepCounter++;
    this.stepCounterElement.nativeElement.innerText =
      this.stepCounter.toString();

    return binaryString;
  }

  resetGame(): void {
    this.binaryCounter = 0;
    this.prevBinaryString = '0'.repeat(this.numberOfDiscs);

    this.stepCounter = 0;
    this.stepCounterElement.nativeElement.innerText =
      this.stepCounter.toString();

    this.binaryNumber.nativeElement.innerText = this.prevBinaryString;
    this.nextStep.nativeElement.disabled = false;

    // Logik zum Zurücksetzen der Türme
    const tower1Element = this.tower1.nativeElement;
    this.renderer.setProperty(tower1Element, 'innerHTML', '');
    let topOffset = 0;
    for (let i = this.numberOfDiscs; i >= 1; i--) {
      const disc = this.renderer.createElement('div');
      this.renderer.setProperty(disc, 'id', 'disc' + i);
      this.renderer.addClass(disc, 'disc');
      this.renderer.setStyle(disc, 'bottom', `${topOffset}px`);
      this.renderer.setStyle(disc, 'width', `${i * 40}px`);
      this.renderer.setProperty(disc, 'innerText', i.toString());
      this.renderer.appendChild(tower1Element, disc);
      topOffset += 40;
    }

    // Logik zum Leeren der anderen Türme
    const tower2Element = this.tower2.nativeElement;
    const tower3Element = this.tower3.nativeElement;
    this.renderer.setProperty(tower2Element, 'innerHTML', '');
    this.renderer.setProperty(tower3Element, 'innerHTML', '');
  }

  private getNextTower(nextTowerNumber: number): HTMLElement {
    switch (nextTowerNumber) {
      case 1:
        return this.tower1.nativeElement;
      case 2:
        return this.tower2.nativeElement;
      case 3:
        return this.tower3.nativeElement;
      default:
        return this.tower1.nativeElement;
    }
  }

  moveDisc(binaryString: string) {
    for (let i = 0; i < binaryString.length; i++) {
      if (binaryString[i] === '1' && this.prevBinaryString[i] === '0') {
        const discNumber = this.numberOfDiscs - i;
        const disc =
          this.tower1.nativeElement.querySelector(`#disc${discNumber}`) ||
          this.tower2.nativeElement.querySelector(`#disc${discNumber}`) ||
          this.tower3.nativeElement.querySelector(`#disc${discNumber}`);

        if (disc) {
          const parentTower = disc.parentElement as HTMLElement;
          let validTowerFound = false;

          if (discNumber === 1) {
            let nextTowerNumber =
              (parseInt(parentTower.id.replace('tower', ''), 10) % 3) + 1;
            let nextTower = this.getNextTower(nextTowerNumber);

            const lastDiscInNextTower = nextTower.lastChild
              ? parseInt(
                  (nextTower.lastChild as HTMLElement).id.replace('disc', ''),
                  10
                )
              : 0;

            if (lastDiscInNextTower === 0 || lastDiscInNextTower > discNumber) {
              nextTower.appendChild(disc);
              disc.style.bottom = `${(nextTower.childElementCount - 1) * 40}px`;
              validTowerFound = true;
            } else {
              nextTowerNumber = nextTowerNumber === 3 ? 1 : 3;

              nextTower = this.getNextTower(nextTowerNumber);

              nextTower.appendChild(disc);
              disc.style.bottom = `${(nextTower.childElementCount - 1) * 40}px`;
              validTowerFound = true;
            }
          } else {
            for (
              let nextTowerNumber = 1;
              nextTowerNumber <= 3;
              nextTowerNumber++
            ) {
              if (
                nextTowerNumber !==
                parseInt(parentTower.id.replace('tower', ''), 10)
              ) {
                let nextTower = this.getNextTower(nextTowerNumber);

                const lastDiscInNextTower = nextTower.lastChild
                  ? parseInt(
                      (nextTower.lastChild as HTMLElement).id.replace(
                        'disc',
                        ''
                      ),
                      10
                    )
                  : 0;

                if (
                  lastDiscInNextTower === 0 ||
                  lastDiscInNextTower > discNumber
                ) {
                  nextTower.appendChild(disc);
                  disc.style.bottom = `${
                    (nextTower.childElementCount - 1) * 40
                  }px`;
                  validTowerFound = true;
                  break;
                }
              }
            }
          }

          if (validTowerFound) {
            console.log(`Successfully moved disc ${discNumber}`);
            break;
          }
        }
      }
    }
    this.prevBinaryString = binaryString;
  }

  adjustNumberOfDiscs(adjustment: number): void {
    this.numberOfDiscs += adjustment;
    this.numberOfDiscs = Math.min(Math.max(this.numberOfDiscs, 3), 8);
    if (this.numberOfDiscsElement) {
      this.numberOfDiscsElement.nativeElement.innerText =
        this.numberOfDiscs.toString();
    }
    this.resetGame();
  }

  onNextStepClick(): void {
    const binaryString = this.incrementBinary();
    this.moveDisc(binaryString);
  }

  onResetClick(): void {
    this.resetGame();
  }

  onIncreaseDiscsClick(): void {
    this.adjustNumberOfDiscs(1);
  }

  onDecreaseDiscsClick(): void {
    this.adjustNumberOfDiscs(-1);
  }
}
