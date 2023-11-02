const int SW_pin = 23;
const int X_pin = 0;
const int Y_pin = 1;
bool swState, swPrev, rightD, leftD, upD, downD = 0;
int x_value, y_value, xMap, yMap, xPrev, yPrev = 0;
const int pIdleValue = 100;
const int nIdleValue = -100;
const int rightPin = 8;
const int leftPin = 9;
const int upPin = 10;
const int downPin = 11;

void setup() {
  pinMode(SW_pin, INPUT);
  pinMode(rightPin, OUTPUT);
  pinMode(leftPin, OUTPUT);
  pinMode(upPin, OUTPUT);
  pinMode(downPin, OUTPUT);
  Serial.begin(115200);
}

bool btnWorking() {
  // Serial.print("x");
  // Serial.println(xMap);
  // Serial.print("y");
  // Serial.print(yMap);

  if (yMap < -312 && (xMap > -330 && xMap < 400)) {
    if (!rightD) {
      Serial.println("rigth");
      rightD = true;
      leftD = !rightD;
      upD = !rightD;
      downD = !rightD;
      return true;
    }


  } else if (yMap > 480 && (xMap < 100 && xMap > -270)) {
    if (!leftD) {
      Serial.println("left");
      leftD = true;
      rightD = !leftD;
      upD = !leftD;
      downD = !leftD;
      return true;
    }


  } else if (xMap > 400 && (yMap > -450 && yMap < 450)) {
    if (!upD) {
      Serial.println("up");
      upD = true;
      rightD = !upD;
      leftD = !upD;
      downD = !upD;
      return true;
    }


  } else if (xMap < -450 && (yMap < 450 && yMap > -450)) {
    if (!downD) {
      Serial.println("down");
      downD = true;
      rightD = !downD;
      leftD = !downD;
      upD = !downD;
      return true;
    }


  } else {
    downD = false;
    rightD = false;
    leftD = false;
    upD = false;
    Serial.println("idle ");
  }
  return false;
}

void loop() {
  swState = digitalRead(SW_pin);
  x_value = analogRead(X_pin);
  y_value = analogRead(Y_pin);
  xMap = map(x_value, 0, 1023, 512, -512);
  yMap = map(y_value, 0, 1023, -512, 512);
  if (swPrev != swState) {
    swPrev = swState;
  }
  if (swPrev != xMap && xPrev != (xMap - 1) && xPrev != (xMap + 1)) {
    xPrev = xMap;
  }
  if (swPrev != yMap && yPrev != (yMap - 1) && yPrev != (yMap + 1)) {
    yPrev = yMap;
  }
  if (btnWorking()) {
    if (downD) {
      digitalWrite(downPin, HIGH);
      delay(1000);
      digitalWrite(downPin, LOW);
    } else if (rightD) {
      digitalWrite(rightPin, HIGH);
      delay(1000);
      digitalWrite(rightPin, LOW);
    } else if (leftD) {
      digitalWrite(leftPin, HIGH);
      delay(1000);
      digitalWrite(leftPin, LOW);
    } else if (upD) {
      digitalWrite(upPin, HIGH);
      delay(1000);
      digitalWrite(upPin, LOW);
    }
    delay(300);
  }
}
