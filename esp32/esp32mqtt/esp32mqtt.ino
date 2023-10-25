#include <WiFi.h>
#include "PubSubClient.h"
#include "LiquidCrystal_I2C.h"


int pinDown = A6;
int pinUp = A7;
int pinLeft = A4;
int pinRight = A5;
int leftPin = 19;
int p18 = 18;
int p5 = 5;
int p17 = 17;

LiquidCrystal_I2C lcd(0x27, 16, 2);
const char* ssid = "Maliwan";
const char* password = "0874800155";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_user = "nasakun13201";
const char* mqtt_password = "pan28060";
IPAddress staticIP(192, 168, 1, 100);  // ตั้งค่าที่อยู่ IP ที่คุณต้องการ
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
const int pin8 = 14;  //5
int LED5 = 25;        // ขา D17
int LED3 = 26;        // ขา D18
int LED4 = 27;        // ขา D19
int btnPin = 23;
bool isLeft, isRight, isUp, isDown = false;
int WiFiStatus;
WiFiClient espClient;
PubSubClient client(espClient);
bool isClick = false;
bool handshake = false;
String Get_WiFiStatus(int Status) {
  switch (Status) {
    case WL_IDLE_STATUS:
      return "WL_IDLE_STATUS";
    case WL_SCAN_COMPLETED:
      return "WL_SCAN_COMPLETED";
    case WL_NO_SSID_AVAIL:
      return "WL_NO_SSID_AVAIL";
    case WL_CONNECT_FAILED:
      return "WL_CONNECT_FAILED";
    case WL_CONNECTION_LOST:
      return "WL_CONNECTION_LOST";
    case WL_CONNECTED:
      return "WL_CONNECTED";
    case WL_DISCONNECTED:
      return "WL_DISCONNECTED";
  }
}

void setup() {
  Serial.println("starting");
  pinMode(pin8, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
  pinMode(leftPin, OUTPUT);
  pinMode(p18, OUTPUT);
  pinMode(p17, OUTPUT);
  pinMode(p5, OUTPUT);
  pinMode(btnPin, INPUT);


  Serial.begin(115200);
  Serial.println("Connecting..");
  WiFi.begin(ssid, password);
  WiFiStatus = WiFi.status();
  while (WiFiStatus != WL_CONNECTED) {
    delay(250);
    WiFiStatus = WiFi.status();
    Serial.println(Get_WiFiStatus(WiFiStatus));
  }
  Serial.println("\nConnected To The WiFi Network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
  // Serial.println();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);


  if (client.connect("esp32-client")) {
    Serial.println("Connected to MQTT broker");
    // Subscribe to the MQTT topic
    client.subscribe("esp32");
    client.publish("sayhi", "Hello, MQTT!");
  } else {
    Serial.println("Failed to connect to MQTT broker");
  }
  lcd.begin();
  lcd.backlight();
  lcd.setCursor(0, 0);          // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความะะะะะะะะะะะะ
  lcd.print("Local ESP32 IP");  //พิมพ์ข้อความ "LCD1602 I2c Test"
  lcd.setCursor(2, 1);          // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
  lcd.print(WiFi.localIP());    //พิมพ์ข้อความ "myarduino.net"
}

void loop() {
  handshake = false;
  int valueLeft = analogRead(pinLeft);
  int valueRight = analogRead(pinRight);
  int valueUp = analogRead(pinUp);
  int valueDown = analogRead(pinDown);

  if (valueLeft > 4000) {
    isLeft = true;
    isRight = !isLeft;
    isUp = !isLeft;
    Serial.print("left c");
    isDown = !isLeft;
    client.publish("move", "a");
    digitalWrite(leftPin, HIGH);
    delay(1800);
    handshake = true;
    digitalWrite(leftPin, LOW);

  } else if (valueRight > 4000) {
    isRight = true;
    isLeft = !isRight;
    isUp = !isRight;
    isDown = !isRight;

    client.publish("move", "d");
    Serial.print("right c");
    digitalWrite(p18, HIGH);
    delay(1800);
    handshake = true;
    digitalWrite(p18, LOW);

  } else if (valueUp > 4000) {
    isUp = true;
    isRight = !isUp;
    isLeft = !isUp;
    Serial.print("up c");
    isDown = !isUp;
    client.publish("move", "w");
    digitalWrite(p17, HIGH);
    delay(1800);
    handshake = true;
    digitalWrite(p17, LOW);

  } else if (valueDown > 4000) {
    isDown = true;
    isRight = !isDown;
    isUp = !isDown;
    Serial.print("down c");
    isLeft = !isDown;
    client.publish("move", "s");
    digitalWrite(p5, HIGH);
    delay(1800);
    handshake = true;
    digitalWrite(p5, LOW);
  }
  int buttonState = digitalRead(btnPin);
  if (buttonState == HIGH && !isClick) {
    Serial.print("send : ");
    isClick = true;
    if (isDown) {
      Serial.print("down");
    } else if (isRight) {
      Serial.print("rigth");
    } else if (isUp) {
      Serial.print("up");
    } else if (isLeft) {
      Serial.print("left");
    }
    isDown = false;
    isRight = false;
    isUp = false;
    isLeft = false;
    client.publish("enter", "enter");
    handshake = true;
    delay(2000);
  } else if (buttonState == LOW && isClick) {
    isClick = false;
    Serial.println("not click");
  }

  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  if (!handshake) {
    client.publish("sayhi", "Hello, MQTT!");
    delay(800);
  }
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();
  Serial.println(messageTemp);

  if (String(topic) == "esp32") {
    Serial.print("Changing output to ");
    if (messageTemp == "enemyturn") {
      digitalWrite(LED4, LOW);
      lcd.clear();
      digitalWrite(LED3, HIGH);
      Serial.println("openLight");
      lcd.setCursor(0, 0);      // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความ
      lcd.setCursor(2, 1);      // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
      lcd.print("enemy turn");  //พิมพ์ข้อความ "myarduino.net"
      delay(750);
      digitalWrite(LED3, LOW);  // สั่งให้ ขา D18 ปล่อยลอจิก 0 ไฟ LED ดับ
      digitalWrite(pin8, HIGH);
    } else if (messageTemp == "yourturn") {
      digitalWrite(pin8, LOW);
      digitalWrite(LED3, HIGH);
      lcd.clear();
      lcd.setCursor(0, 0);  // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความ
      lcd.setCursor(2, 1);  // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
      lcd.print("your turn");
      delay(750);
      digitalWrite(LED3, LOW);
      digitalWrite(LED4, HIGH);

    } else if (messageTemp == "error") {
      digitalWrite(LED3, HIGH);
      digitalWrite(LED5, HIGH);
      delay(750);
      digitalWrite(LED5, LOW);
      digitalWrite(LED3, LOW);
    } else if (messageTemp == "yourlose" || messageTemp == "yourwin" || messageTemp == "draw") {
      digitalWrite(pin8, LOW);
      digitalWrite(LED3, LOW);
      lcd.clear();
      lcd.setCursor(0, 0);  // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความ
      lcd.setCursor(2, 1);  // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
      lcd.print("game result");
      delay(750);
      digitalWrite(LED3, LOW);
      digitalWrite(LED4, LOW);
      if (messageTemp == "yourlose") {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.setCursor(2, 1);
        lcd.print("your lose");
      } else if(messageTemp == "yourwin") {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.setCursor(2, 1);
        lcd.print("your win");
      }
      else{
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.setCursor(2, 1);
        lcd.print("Draw");
      }
      delay(10000);
      lcd.clear();
      lcd.setCursor(0, 0);          // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความะะะะะะะะะะะะ
      lcd.print("Local ESP32 IP");  //พิมพ์ข้อความ "LCD1602 I2c Test"
      lcd.setCursor(2, 1);          // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
      lcd.print(WiFi.localIP());    //
    }
  }
}
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_user, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}