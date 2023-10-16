#include <WiFi.h>
#include "PubSubClient.h"
#include "LiquidCrystal_I2C.h"
#include "ezButton.h"
const int joystick_x_pin = A0; 
const int joystick_y_pin = A3;
// #define SW_PIN  G35
#define LEFT_THRESHOLD  1000
#define RIGHT_THRESHOLD 3000
#define UP_THRESHOLD    1000
#define DOWN_THRESHOLD  3000

#define COMMAND_NO     0x00
#define COMMAND_LEFT   0x01
#define COMMAND_RIGHT  0x02
#define COMMAND_UP     0x04
#define COMMAND_DOWN   0x08

// ezButton button(SW_PIN);
int command = COMMAND_NO;
float xValue = 0; // To store value of the X axis
float yValue = 0; // To store value of the Y axis
int bValue = 0; // To store value of the button

LiquidCrystal_I2C lcd(0x27, 16, 2);
const char* ssid = "Zmksdks";
const char* password = "113333555555";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_user = "nasakun13201";
const char* mqtt_password = "pan28060";
IPAddress staticIP(192, 168, 1, 100); // ตั้งค่าที่อยู่ IP ที่คุณต้องการ
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
const int pin8 = 5;
int LED3 = 18; // ขา D18
int LED4 = 19; // ขา D18
int LED5 = 17; // ขา D18

 
int WiFiStatus;
WiFiClient espClient;
PubSubClient client(espClient);

String Get_WiFiStatus(int Status){
    switch(Status){
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
 
void setup(){
  Serial.println("starting");
    pinMode(pin8, OUTPUT);  
    pinMode(LED3, OUTPUT);
    pinMode(LED4, OUTPUT);
    Serial.begin(115200);
    Serial.println("Connecting..");
    WiFi.begin(ssid, password);
    WiFiStatus = WiFi.status();
    while(WiFiStatus != WL_CONNECTED){
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
       client.publish("yourTopic", "Hello, MQTT!");
  } else {
    Serial.println("Failed to connect to MQTT broker");
  }
  lcd.begin();
  lcd.backlight();
  lcd.setCursor(0, 0); // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความ
  lcd.print("Local ESP32 IP"); //พิมพ์ข้อความ "LCD1602 I2c Test"
  lcd.setCursor(2, 1); // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
  lcd.print(WiFi.localIP()); //พิมพ์ข้อความ "myarduino.net"
  // button.setDebounceTime(50);
}
 
void loop(){
  // digitalWrite(LED3, HIGH); // สั่งให้ ขา D18 ปล่อยลอจิก 1 ไฟ LED ติด
  // delay(100);
  // digitalWrite(LED3, LOW);  // สั่งให้ ขา D18 ปล่อยลอจิก 0 ไฟ LED ดับ
  // delay(100);
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  // btnControll();
  // ส่งข้อความ "Hello, MQTT!" ไปยัง MQTT broker
  // client.publish("yourTopic", "Hello, MQTT!");
}
void callback(char* topic, byte* message, unsigned int length){
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


  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic esp32/output, you check if the message is either "on" or "off". 
  // Changes the output state according to the message
  if (String(topic) == "esp32") {
    Serial.print("Changing output to ");
    if (messageTemp== "openLight") {
      digitalWrite(LED4, LOW);
      lcd.clear();
      digitalWrite(LED3, HIGH);
      Serial.println("openLight");
      lcd.setCursor(0, 0); // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความ
      lcd.setCursor(2, 1); // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
      lcd.print("enemy turn"); //พิมพ์ข้อความ "myarduino.net"
      delay(750);
      digitalWrite(LED3, LOW);  // สั่งให้ ขา D18 ปล่อยลอจิก 0 ไฟ LED ดับ
      digitalWrite(pin8, HIGH); 
       
       // สั่งให้ ขา D18 ปล่อยลอจิก 1 ไฟ LED ติด
      
      
  }
    else if(messageTemp == "closeLight"){
      digitalWrite(pin8, LOW);
      digitalWrite(LED3, HIGH);
      lcd.clear();
      lcd.setCursor(0, 0); // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรตำแหน่งที่0 แถวที่ 1 เตรียมพิมพ์ข้อความ
      lcd.setCursor(2, 1); // กำหนดให้ เคอร์เซอร์ อยู่ตัวอักษรกำแหน่งที3 แถวที่ 2 เตรียมพิมพ์ข้อความ
      lcd.print("your turn");
      delay(750);
      digitalWrite(LED3, LOW); 
      digitalWrite(LED4, HIGH);
       //พิมพ์ข้อความ "myarduino.net"
    }
    else if(messageTemp == "error"){
      digitalWrite(LED3, HIGH);
      digitalWrite(LED5, HIGH);
      delay(750);
      digitalWrite(LED5, LOW);  
      digitalWrite(LED3, LOW);
    }
  }
  
}
void btnControll(){
  int x_adc_val, y_adc_val; 
  x_adc_val = analogRead(joystick_x_pin); 
  y_adc_val = analogRead(joystick_y_pin);
  xValue = ( ( x_adc_val * 3.3 ) / 4095 );  /*Convert digital value to voltage */
  yValue = ( ( y_adc_val * 3.3 ) / 4095 );  /*Convert digital value to voltage */
  Serial.print("xValue :");
  Serial.println(xValue);
  Serial.print("yValue :");
  Serial.println(yValue);
  // converts the analog value to commands
  // reset commands
  command = COMMAND_NO;

  // check left/right commands
  if (xValue < LEFT_THRESHOLD)
    command = command | COMMAND_LEFT;
  else if (xValue > RIGHT_THRESHOLD)
    command = command | COMMAND_RIGHT;

  // check up/down commands
  else if (yValue < UP_THRESHOLD)
    command = command | COMMAND_UP;
  else if (yValue > DOWN_THRESHOLD)
    command = command | COMMAND_DOWN;

  // NOTE: AT A TIME, THERE MAY BE NO COMMAND, ONE COMMAND OR TWO COMMANDS

  // print command to serial and process command
  if (command & COMMAND_LEFT) {
    Serial.println("COMMAND LEFT");
    // TODO: add your task here
  }

  else if (command & COMMAND_RIGHT) {
    Serial.println("COMMAND RIGHT");
    // TODO: add your task here
  }

  else if (command & COMMAND_UP) {
    Serial.println("COMMAND UP");
    // TODO: add your task here
  }

  else if (command & COMMAND_DOWN) {
    Serial.println("COMMAND DOWN");
    // TODO: add your task here
  }
  delay(5000);
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