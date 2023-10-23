#include <SoftwareSerial.h>
SoftwareSerial ESPSerial(0, 1);
const int SW_pin = 23;
const int X_pin = 0;
const int Y_pin = 1;
bool swState, swPrev,rightD,leftD,upD,downD = 0;
int x_value  , y_value , xMap,yMap,xPrev,yPrev = 0;
const int pIdleValue = 100;
const int nIdleValue = -100;
const int rightPin = 8;
const int leftPin = 9;
const int upPin = 10;
const int downPin = 11;

void setup() {
pinMode(SW_pin,INPUT);
pinMode(rightPin,OUTPUT);
pinMode(leftPin,OUTPUT);
pinMode(upPin,OUTPUT);
pinMode(downPin,OUTPUT);
Serial.begin(115200);
 ESPSerial.begin(115200);
}

bool btnWorking(){
    // Serial.print("x");
    // Serial.println(xMap);
    // Serial.print("y");
    // Serial.print(yMap);

  if(yMap == -512 && (xMap > -330 && xMap < 400)){
    if(!rightD){
    Serial.println("rigth");
    rightD = true;
    leftD = !rightD;
    upD = !rightD;
    downD = !rightD;
        return true;
    }
   

  }
  else if(yMap == 512 && (xMap < 100 && xMap >-270))
  {
    if(!leftD){
 Serial.println("left");
    leftD = true;
    rightD = !leftD;
    upD = !leftD;
    downD = !leftD;
     return true;
    }
   
  
  }
  else if(xMap == 512 && (yMap > -450 && yMap < 450) ){
    if(!upD){
Serial.println("up");
     upD = true;
    rightD = !upD;
    leftD = !upD;
    downD = !upD;
      return true;
    }
    

  }
  else if(xMap == -512 && (yMap < 450 && yMap > -450)){
    if(!downD){
 Serial.println("down");
    downD = true;
    rightD = !downD;
    leftD = !downD;
    upD = !downD;
    return true;
    }
   
   
  }
  else {
    downD = false;
    rightD =false;
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
  xMap = map(x_value,0,1023,512,-512);
  yMap = map(y_value,0,1023,-512,512);
    if(swPrev != swState){
      swPrev = swState;
    }
    if(swPrev!=xMap && xPrev != (xMap-1)&& xPrev!= (xMap+1)){
      xPrev = xMap;
    }
    if(swPrev!=yMap && yPrev != (yMap-1)&& yPrev!= (yMap+1)){
      yPrev = yMap;
    }
    if(btnWorking()){
  if(downD){
     ESPSerial.write("1");
   digitalWrite(downPin,HIGH);
     delay(500);
     digitalWrite(downPin,LOW);
  }
  else if(rightD){\
     ESPSerial.write("2");

 digitalWrite(rightPin,HIGH);
     delay(500);
     digitalWrite(rightPin,LOW);
  }
   else if(leftD){
     ESPSerial.write("3");


     digitalWrite(leftPin,HIGH);
     delay(500);
     digitalWrite(leftPin,LOW);
  }
   else if(upD){
     ESPSerial.write("4");

      digitalWrite(upPin,HIGH);
     delay(500);
     digitalWrite(upPin,LOW);
  }
      delay(800);

    }
    
}
