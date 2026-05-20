## **TCS 015 - 2016** 

Specification for 

## Variable Message Signs 

February 2016 Page 1 of 52 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **TCS 015 – 2016** 

## **Foreword** 

This specification has been developed by VicRoads.  It is one of a number of technical specifications, and associated standard drawings, which set out the requirements for roadside ITS devices, traffic signal equipment and other electrical equipment and associated devices and control systems. 

This specification is intended for use in all relevant works undertaken by or on behalf of VicRoads. 

VicRoads Standard Drawings, Specifications and Guidelines are available for downloading from VicRoads website at the following address under ‘Tenders & Suppliers’, http://www.vicroads.vic.gov.au/itsspecs 

## **COPYRIGHT** 

© Road Corporation trading as VicRoads.  All rights reserved. 

This document remains the property of VicRoads. No part of this document  may be reproduced or copied in any form or by any means, electronic or mechanical, including photocopying, without the written permission of VicRoads 

**Specification updates.** VicRoads specifications and associated standard drawings are subject to periodic review.  To keep the specifications up to date, amendments or new editions are issued as necessary.  It is therefore important for users of VicRoads specifications to ensure that they have the latest version and associated amendments. 

**Road Operations 60 Denmark Street  Kew  3101 Phone: (03) 9854 2103    Fax: (03) 9854 2319** 

## **Revision History** 

|**Revision**|<br>**Date**|**Description**|
|---|---|---|
|A|February 2016|2016 Version Initial release|



Page 2 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **PREFACE** 

## **A. TELECOMMUNICATIONS EQUIPMENT** 

- A.1 All telecommunications equipment shall comply with relevant requirements of the Australian Communications and Media Authority (ACMA).  Such equipment shall be labelled with a Regulatory Compliance Mark. 

## **B. CHANGES TO THIS SPECIFICATION** 

- B.1 The main changes to this specification from previous versions are listed below: 

   - Reformatted 

   - Revised operation and control section 

   - Changes to Pictogram operation 

   - Removal of hard reset 

   - Inclusion of VicRoads extensions to RMS Protocol for VMS 

- B.2 The following table details previous versions to this specification 

|**Date**|**Revision Owner**|**Details**|
|---|---|---|
|February 2016|VicRoads ITS|2016 Revision A<br>Specification fullyrevised and reformatted|
|2011|VicRoads ITS|Version 6 released|
|2004|VicRoads ITS|Version 5 released|
|2000|VicRoads ITS|Version 4 released|



Page 3 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

Page intentionally left blank 

Page 4 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **Contents** 

|**SECTION 1**<br>**SCOPE AND GENERAL .............................................................................. 8**|**SECTION 1**<br>**SCOPE AND GENERAL .............................................................................. 8**|
|---|---|
|1.1|SCOPE .................................................................................................................................... 8|
|1.2|GENERAL .............................................................................................................................. 8|
|1.3|CCTV CAMERA COVERAGE ............................................................................................. 9|
|1.4|INTELLECTUAL PROPERTY ............................................................................................. 9|
|**SECTION 2**<br>**RELATED SPECIFICATIONS AND DRAWINGS ................................ 10**||
|2.1|GENERAL ............................................................................................................................ 10|
|2.2|EXCEPTIONS AND CLARIFICATION TO AS 4852.1 ..................................................... 11|
|**SECTION 3**<br>**ACRONYMS ................................................................................................ 12**||
|**SECTION 4**<br>**OPERATION AND CONTROL ................................................................. 13**||
|4.1|GENERAL ............................................................................................................................ 13|
|4.2|SIGN CONTROL PERFORMANCE AND CAPABILITY ................................................. 13|
|4.3|SIGN CONTROLLER (SC) ................................................................................................. 13|
|4.4|ADMINISTRATION AND CONFIGURATION TOOL ..................................................... 14|
|4.5|RESET .................................................................................................................................. 18|
|4.6|SIGN CONTROLLER PARAMETER DEFAULT SETTINGS .......................................... 19|
|4.7|ETHERNET .......................................................................................................................... 20|
|4.8|RMS PROTOCOL FOR SIGN CONTROL ......................................................................... 20|
|4.9|OTHER PROTOCOLS ......................................................................................................... 20|
|4.10|HARDWARE SERIAL PORTS: .......................................................................................... 21|
|4.11|DIAGNOSTIC FUNCTIONS ............................................................................................... 22|
|4.12|MONITORING, FAULT LOGGING AND REPORTING .................................................. 22|
|4.13|LOCAL CONTROL ............................................................................................................. 23|
|4.14|REMOTE CONTROL .......................................................................................................... 24|
|4.15|MANUAL OVERRIDE FACILITY SWITCH CONTROL ................................................. 24|
|4.16|FALL-BACK SYSTEM ....................................................................................................... 25|
|4.17|DISPLAY TEST PATTERNS .............................................................................................. 25|
|4.18|FIRMWARE UPGRADE ..................................................................................................... 25|
|**SECTION 5**<br>**DISPLAY AND OPTICAL REQUIREMENTS........................................ 26**||
|5.1|GENERAL ............................................................................................................................ 26|
|5.2|DISPLAYS ........................................................................................................................... 26|
|5.3|SIGN DIMMING CONTROL .............................................................................................. 26|
|5.4|CHARACTER FORMATS................................................................................................... 26|
|5.5|DISPLAY CHANGES .......................................................................................................... 27|
|5.6|OPTICAL REQUIREMENTS .............................................................................................. 27|
|5.6.1<br>Photometric Requirements ............................................................................................ 27||
|5.6.2<br>Colormetric Requirements ............................................................................................ 27||
|5.6.3<br>Lifespan Requirements ................................................................................................. 27||



Page 5 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

|**SECTION 6**<br>**COLOUR PICTOGRAM ............................................................................ 28**|
|---|
|6.1<br>GENERAL ............................................................................................................................ 28|
|6.2<br>PICTOGRAM DISPLAY REGION ..................................................................................... 28|
|6.3<br>PICTOGRAM OPTICAL REQUIREMENTS ..................................................................... 29|
|6.3.1<br>Photometric Requirements ............................................................................................ 29|
|6.3.2<br>Colormetric Requirements ............................................................................................ 29|
|6.3.3<br>Lifespan Requirements ................................................................................................. 29|
|6.4<br>DISPLAY CHANGES .......................................................................................................... 29|
|**SECTION 7**<br>**ELECTRICAL REQUIREMENTS ........................................................... 30**|
|7.1<br>GENERAL ............................................................................................................................ 30|
|7.2<br>OPERATING VOLTAGE .................................................................................................... 30|
|7.3<br>POWER................................................................................................................................. 30|
|7.4<br>BATTERY BACK-UP .......................................................................................................... 31|
|7.5<br>INTERNAL PROTECTION ................................................................................................. 31|
|7.6<br>EMC COMPLIANCE ........................................................................................................... 31|
|7.7<br>SOCKET OUTLETS ............................................................................................................ 31|
|**SECTION 8**<br>**MECHANICAL AND PHYSICAL REQUIREMENTS .......................... 32**|
|8.1<br>GENERAL ............................................................................................................................ 32|
|8.2<br>SIGN ENCLOSURE ............................................................................................................. 32|
|8.3<br>SIGN SUPPORT STRUCTURE AND ASSOCIATED FOOTING..................................... 32|
|8.4<br>SIGN CONTROLLER HOUSING ....................................................................................... 33|
|8.5<br>FACILITY SWITCH ............................................................................................................ 33|
|8.6<br>MARKINGS AND LABELS................................................................................................ 34|
|**SECTION 9**<br>**ENVIRONMENTAL ................................................................................... 35**|
|9.1<br>GENERAL ............................................................................................................................ 35|
|9.2<br>ELECTROMAGNETIC COMPATIBILITY (EMC) ........................................................... 35|
|**SECTION 10**<br>**MARKINGS .............................................................................................. 36**|
|10.1<br>MARKINGS ......................................................................................................................... 36|
|**SECTION 11**<br>**DOCUMENTATION ............................................................................... 37**|
|11.1<br>DOCUMENTATION ........................................................................................................... 37|
|**APPENDIX A ......................................................................................................................... 38**|
|VICROADS ITS PLATFORM ......................................................................................................... 38|
|**APPENDIX B ......................................................................................................................... 39**|
|VICROADS EXTENSION TO RMS PROTOCOL FOR VMS....................................................... 39|
|**APPENDIX C ......................................................................................................................... 47**|
|GENERAL REQUIREMENTS FOR TESTING .............................................................................. 47|
|**APPENDIX D ......................................................................................................................... 48**|
|LIFETIME PERFORMANCE REQUIREMENTS .......................................................................... 48|
|**APPENDIX E ......................................................................................................................... 50**|



Page 6 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

REQUIREMENTS FOR APPROVAL ............................................................................................. 50 **APPENDIX F ......................................................................................................................... 52** GUIDELINES FOR PURCHASING AND INSTALLATION ........................................................ 52 

Page 7 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 1** 

## **SCOPE AND GENERAL** 

## **1.1 SCOPE** 

- 1.1.1 This document covers the requirements for the design and manufacture of variable message signs (VMS) typically used in fixed, freeway applications by VicRoads within the State of Victoria. 

- 1.1.2 VMS covered by this specification may also be used on arterial roads with speed limits above 80km/h 

- 1.1.3 VMS covered by this specification shall be Type C as defined in Australian Standard AS 4852.1 – 2009: “Variable message signs – Part 1: Fixed signs” Section 3.1.2. 

- 1.1.4 Within this specification a VMS is defined as a roadside device for the purpose of providing real time, changeable advice to road users in an alpha-numeric and/or symbolic format. 

- 1.1.5 The design and manufacture of all components of a VMS shall be undertaken in accordance with this specification and individual tender documents. 

## **1.2 GENERAL** 

- 1.2.1 VMS’s shall comply with the Australian Standard AS 4852.1 – 2009:  Variable message signs – Part 1: Fixed signs”.  This VicRoads specification covers any additions and/or exceptions to AS 4852.1. 

- 12.2 Where this specification differs from AS 4852.1 – 2009, this specification shall have precedence. 

- 1.2.3 Messages shall be capable of being displayed on the VMS using the RMS VMS communication protocol as detailed in the RMS specification TSI-SP-003. 

- 1.2.4 The sign shall typically be mounted above a carriageway on a gantry or adjacent to the carriageway such that it is clearly visible from each lane of the carriageway of the approach to which each sign applies. 

- 1.2.5 The sign shall be designed to provide legible, changeable alpha-numeric information relating to on-road incidents, real time traffic information, travel time information and other traffic management activities during both day-time and night-time operations. 

- 1.2.6 The sign design and operation shall comply with the requirements of AustRoads Guide to Traffic management Part 10, Variable Message Signs. 

- 1.2.7 Where specified in individual tender documents, the sign shall include a four colour pictogram section as specified in Section 6 of this specification. 

- 1.2.8 Where a Pictogram is specified in individual tender documents, it shall be capable of displaying colour messages on the Pictogram area using the RMS VMS communication 

Page 8 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

protocol as detailed in the RMS specification TSI-SP-003 together with the RMS specification ITSM-TO-ITS-CSI-002 and VicRoads extension to the RMS protocol, Appendix B. 

- 1.2.9 A typical layout of a VMS including a colour Pictogram is shown in Figure 1.1. 

**==> picture [274 x 11] intentionally omitted <==**

**----- Start of picture text -----**<br>
Colour Pictogram Area  VMS message area<br>**----- End of picture text -----**<br>


**==> picture [433 x 122] intentionally omitted <==**

**Figure 1.1 – Typical sign layout including pictogram area** 

## **1.3 CCTV CAMERA COVERAGE** 

- 1.3.1 If possible, a VMS should be located in a position that enables it to be viewed using an existing VicRoads CCTV camera. 

- 1.3.2 Where an existing camera is not available, a camera shall be installed for that purpose in accordance with VicRoads specification TCS 067, Digital CCTV Camera. 

## **1.4 INTELLECTUAL PROPERTY** 

- 1.4.1 In relation to all Intellectual Property used in/or to operate the VMS , the contractor grants to VicRoads non exclusive licence to “use, modify and/or sell” or do anything else that without the licence, could be breach of the licensors Intellectual Property. 

- 1.4.2 Intellectual Property shall include, but not be limited to, the following: 

   - Software 

   - Source code(s) 

   - Schematic diagrams 

   - Circuit diagrams 

   - Wiring diagrams 

   - Listings of components and sub-components 

   - Any and all operational and maintenance documentation 

Page 9 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 2 RELATED SPECIFICATIONS AND DRAWINGS** 

## **2.1 GENERAL** 

- 2.1.1 The fabrication and supply of all components shall conform with all relevant Australian Standards. 

- 2.1.2 All installation works shall conform to the relevant VicRoads specifications and related specifications and standards as indicated throughout this document. 

- 2.1.3 The following related Australian Standards are referenced: 

AS 4100 Steel structures AS 4852.1 Variable message signs – Part 1: Fixed signs AS 5100 Bridge Design AS 60038 Standard voltages AS 61000.6.3 Generic standards – Emission standard for residential, commercial and light industrial environments AS 61558 Safety of power transformers, power supply units and similar 

- 2.1.4 The following documents and Standards are referenced: 

Austroads Guide to Traffic Management Part 10: Traffic Control and Communication Devices, Section 5 Electronic Signs BTN 2010/001 VicRoads Bridge Technical Note BTN 2010/001 November 2010 Design of Steel Cantilever and Portal Sign Structures and High Mast Light Poles IEEE 802.3 IEEE Standard for Information Technology – Specific Requirements: Part 3 RMS Specification Colour Sign Interface ITSM-TO-ITS-CSI- _Only available from RMS_ 002 RMS Specification Communications protocol for roadside devices TSI-SP-003 _Only available from RMS_ STREAMS VicRoads ITS platform. 

Page 10 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **2.2 EXCEPTIONS AND CLARIFICATION TO AS 4852.1** 

The requirements of AS 4852.1 shall apply to VMS with the exception of the following clauses. 

|**AS 4852.1**<br>**Clause**|||
|---|---|---|
||**Description**|**Exceptions to AS 4852.1 Clause**|
||||
|2.1.1|General|None|
|2.1.2|Sign enclosure|None|
|2.1.3|Sign support structure|Clause modified.  See Section 6.3|
|2.1.4.1|Control housing- General|Modified.  See Section 6.4|
|2.1.4.2|Facilityswitch|Modified.  See Section 6.5|
|2.2|Electrical requirements|Modified.  See Section 5|
|2.3|Communications equipment|Modified.  See Section 2|
|2.4|Real time clock|Modified.  See Section 2.9.1|
|2.5|Markings and labels|None|
|3.1.1|Displayrequirements –general|None|
|3.1.2|Displaydimensional requirements|Modified.  See Section 3.2|
|3.1.3|LED|None|
|3.1.4|LED arrangement|None|
|3.1.5|Character formats|Modified.  See Section 3.4|
|3.1.6|Displaychanges|Modified.  See Section 3.5|
|3.1.7|Display change due to facility switch<br>operation|Modified.  See Section 2.15|
|3.1.8|Display change due to external<br>switch inputs|None|
|3.1.9|Graphics requirements|None|
|3.1.10|Displaycolours|None|
|3.1.11|Sign dimming|Modified.  See Section 3.3|
|3.1.12|Conspicuitydevices|Clause does not apply|
|3.1.12|Displayflicker|None|
|3.2|Optical requirements|Modified.  See Section 3.6|
|4|Operation and control|Modified.  See Section 2|
|5.1|Environmental Requirements|Modified.  See Section 7|



Page 11 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 3 ACRONYMS** 

- 3.1 The acronyms used in this document shall be interpreted as follows: 

   - ACMA Australian Communications and Media Authority AS Australian Standard CCTV Closed Circuit Television CLI Command Line Interface CSV Comma Separated Values DHCP Dynamic Host Configuration Protocol DNS Domain Name System EMC Electromagnetic Compatibility FP Field Processor as used with STREAMS HTTP Hypertext Transfer Protocol HTTPS Hypertext Transfer Protocol Secure ICMP Internet Control Message Protocol IEC International Electrotechnical Commission IEEE Institute of Electrical and Electronics Engineers IP Internet Protocol ITS Intelligent Transport Systems NMS Network Management System NTP Network Time Protocol TCP Transmission Control Protocol LED Light Emitting Diode PE Cell Photo Electric Cell RCD Residual Current Device RMS Roads and Maritime Services of NSW (previously known as Roads and Traffic Authority, RTA) 

   - SC Sign Controller SSH Secure Shell SSL Secure Sockets Layer STREAMS An ITS communications/control platform used by VicRoads to manage traffic operations on freeways 

   - TCP/IP Transmission Control Protocol/Internet Protocol TLS Transport Layer Security 

Page 12 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 4** 

## **OPERATION AND CONTROL** 

## **4.1 GENERAL** 

- 4.1.1 A communication link to the sign, as specified in the tender documents, shall be provided in accordance with AS 4852.1 Section 2.3. 

- 4.1.2 The sign shall be capable of the following: 

   - Displaying instantaneous messages downloaded from any third-party controlling device connected to the serial port or Ethernet port, which will temporarily override any current displays, strings or scheduling until the instantaneous messages are completed. 

   - Displaying frames in different appearance modes. 

   - Displaying any approved font, graphic or display which fits into the given matrix, irrespective of what pixels are on or off. 

   - Provide a list of alarms and reporting procedures. 

- 4.1.3 This section on operation and control assumes the inclusion of the pictogram as specified in Section 6 of this specification. 

## **4.2 SIGN CONTROL PERFORMANCE AND CAPABILITY** 

- 4.2.1 The sign shall be used for travel time information displays and the message will be updated every two minutes.  Therefore the sign shall have the capability to support writing at least 900 messages a day. 

- 4.2.2 The VicRoads control system uses frames numbers from 200 to 255 for displaying those frequently updated messages. 

- 4.2.3 The response time (the latency from when VicRoads FP sends a request message to when a valid response message is received by the FP, i.e. the response time includes the time for transferring the request message from the FP to the sign controller via a serial link, sign controller processing time for generating a valid response message and the time for transferring the valid response from the sign controller to the FP via serial link) shall be less than 2 seconds. 

## **4.3 SIGN CONTROLLER (SC)** 

- 4.3.1 The entire whole sign shall be controlled by a single Sign Controller.  Under normal operation, its main purpose is to provide both serial and Ethernet interfaces to a third-party controlling device, over which RMS protocol shall be transmitted in order to control the mono-colour text region, and a 4 colour pictogram region if required, of the connected VMS. 

- 4.3.2 The sign controller shall be designed to be installed within a standard 19’’ rack. 

Page 13 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 4.3.3 An alternative cabinet may be considered provided it is designed to be mounted onto the standard VicRoads cabinet foundation. 

- 4.3.4 The rack-mounting chassis shall be no more than 2 RU in height, and either full or half 19’’ rack width.  Half-width 19’’ modules shall be mountable on both the left and the right sides. 

- 4.3.5 If the sign has a text and a pictogram region, the Sign Controller shall ensure: 

   - 1) Both regions are in sync (displaying frames and blanking simultaneously). 

   - 2) If both regions are failed, not to display any messages on either region. If the pictogram region is failed but the text region is working, continue to display the message on the text region; If the pictogram region is working, but the text region is failed, not to display any messages on either region. 

- 4.3.6 All of the controller’s communication and power interfaces shall be clearly and indelibly labelled on the controller housing. 

## **4.4 ADMINISTRATION AND CONFIGURATION TOOL** 

- 4.4.1 The sign controller shall provide an interactive browser based user interface using HTTP and HTTPS to provide monitoring, configuration and diagnostic related functions. 

- 4.4.2 Providing a Command Line Interface (CLI) based configuration interface is not mandated, however, if provided, the interface shall: 

   - Support key-based and password authentication, with the capability to disable password authentication 

   - SSH v2.x shall be required (SSH v1 shall not be used) 

   - Only support CLI over TCP/IP.  The SC shall not have any serial based console port on the controller chassis, which can be used to access the SC CLI interface. 

- 4.4.3 The software shall provide for the display and monitoring of the sign controller configuration, including: 

   - Site Name 

   - Firmware version 

   - Current Temperature of the controller 

   - Main Power Supply status 

   - Backup Power Supply Status (if one exists) 

   - Up Time (since last reset) 

   - System time (Local date and time) 

   - MAC Address(es) of all Ethernet port(s) 

   - Current Active Control Mode (Local, serial, TCP or any other mode if present) 

   - Facility Switch position 

   - All the signs connected to the controller and, for each sign, the following information shall be displayed: 

      - RMS protocol Group ID 

      - RMS protocol Sign ID 

      - Dimensions (in pixel) 

      - Luminance dimming control mode (Auto, Time based or Fixed) 

Page 14 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

      - Current Luminance dimming level 

      - RMS Protocol Session Status (Online / Offline) 

      - RMS Protocol Display Mode(Message, Frame or Plan) 

      - RMS Protocol Display Message Number/Frame Number/Plan Number 

      - Current Sign firmware version 

- 4.4.4 Configuration Functions – The software shall allow a user to change sign controller and sign configurations using the browser interface.  In general, all configuration changes shall be applied immediately and take effect without the need to restart/reset the sign controller. However, changing certain parameters may cause any currently active connection to be dropped, for example, the sign’s password or seed offset, IP port number, etc.  The following parameters shall be configurable. 

   - (a) The Site Name – Text field with minimum 150 characters. 

   - (b) Control Mode – The software shall allow a user to choose an active control mode from the following: 

         - Local mode – When this mode is enabled, a user can use the browser interface to control the sign display to display a message or run test patterns.  When this mode is disabled, a user shall not be able to use this web software to control the sign display to display a message or run test patterns. 

         - Serial – When this mode is enabled, the master (refer to RMS protocol section 2.1) software can connect to sign controller via serial connection, and control the sign using RMS protocol.  When this mode is disabled, and there is currently an active serial connection, the controller shall drop the connection and blank the sign(s). 

When this mode is disabled and the master software attempts to connect to the sign controller via the serial connection using RMS protocol, the sign controller shall respond with a ‘Reject’ message (MI code 00h) with Application Error code ‘01’ (Device Controller offline) to the ‘Start Session’ message (MI code 02h) sent by the master software.  However, the sign controller shall still respond to ‘Heartbeat Poll’ messages (MI Code 05h) as specified in RMS Protocol Section 3.6.3.6. 

- (c) TCP/IP – When this mode is enabled, the master (refer to RMS protocol section 2.1) software can connect to sign controller via TCP/IP connection, and control the sign using RMS protocol. 

When this mode is disabled, if there is currently an active TCP/IP connection, the controller shall drop the connection and blank the sign(s).  When this mode is disabled and the master software attempts to connect to the sign controller via TCP/IP using RMS protocol, the sign controller shall respond with a ‘Reject’ message (MI code 00h) with Application Error code ‘01’ (Device Controller offline) to the ‘Start Session’ message (MI code 02h) sent by the master software.  However, the sign controller shall still respond to ‘Heartbeat Poll’ messages (MI Code 05h) as specified in RMS Protocol Section 3.6.3.6. 

_Note: the control mode is exclusive. Once a mode is chosen, the other two modes shall be disabled._ 

Page 15 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 4.4.5 Network configuration – The software shall allow a user to change the following network configurations: 

   - IP address allocation (DHCP or static). 

   - If the IP address allocation is static – the following parameters: IP Address, Subnet Mask, Default Gateway, Primary DNS and Secondary DNS. 

- 4.4.6 RMS Protocol Configuration – The software shall allow a user to change the following RMS Protocol and communications related configuration parameters: 

   - IP Port used for TCP/IP connection. 

   - Session time out for TCP/IP connection (in seconds). 

   - Security settings for TCP/IP connection (such as switch between no encryption and TLS encrypted, TLS port to be used). 

   - Baud rate, Data bits, Parity and Stop bits for serial connection. 

   - Session time out for serial connection (in seconds). 

   - Seed offset (in Hex). 

   - Password offset (in Hex). 

   - Polling Address. 

   - Broadcast Address. 

   - Blanking Time out (in minutes, the duration that the sign controller will wait before blanking the sign after the active RMS protocol connection is disconnected.). 

   - Sign ID and Group ID (For individual signs). 

- 4.4.7 Luminance Dimming control – The software shall allow a user to change the following sign dimming control related configuration for each individual sign connected to the sign controller: 

   - Luminance Dimming control mode (Auto, Time Based or Fixed).  Three modes are defined in AS 4852.1 – 2009 Section 3.11. 

   - The controller shall have pre-defined ‘Dawn’ and ‘Dusk’ times for Time Based mode as specified in AS 4852.1 – 2009 Section 3.11 and the software shall allow a user to change those time settings. 

   - Fixed Dimming Level (in ‘Fixed’ mode only). 

- 4.4.8 System Time – The software shall allow a user to change the current time, time zone, Daylight saving option and whether to use an NTP server for time synchronisation.  The IP address(es) of the NTP servers shall be configurable. 

- 4.4.9 Security – The software shall: 

   - Allow a user to change the browser interface’s username and password. 

   - Support both HTTP and HTTPS and allow a user to choose the access mode from ‘HTTP only’, ‘HTTPS only’ and ‘Both HTTP and HTTPS’. 

   - Allow a user to change the TCP/IP ports used for ‘HTTP’ and ‘HTTPS’. 

   - Allow a user to change the session timeout for the browser interface (duration after the last active web request received). 

- 4.4.10 Control and Testing – The software shall allow a user to perform local control and display test patterns functions specified in Section 4.13 “Local Control” and 4.18 “Display Test Patterns” of this specification. 

- 4.4.11 Administration – The software shall provide the following administration functions. 

Page 16 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## 4.4.12 Firmware upgrade 

- The software shall allow a user to the upgrade the controller’s firmware. After the firmware is upgraded, all existing pre-configured parameters (IP addresses, network mask, default gateway and etc) for the controller shall be maintained. 

- The software shall allow a user to upgrade firmware for individual signs that are connected to the sign controller. 

- The system shall ensure that the entire firmware file is successfully downloaded before attempting to apply the firmware upgrade. 

## 4.4.13 Save /recover configuration to/from file. 

- All of the configuration parameters for the controller shall be able to be saved and retained after rebooting the controller. 

- The software shall allow a user to save the current configuration to a local file and be able to restore all the configuration parameters from the file. 

## 4.4.14 Reboot and Reset. 

The software shall allow a user to reboot/reset the controller with the following options: 

- Reset to manufacturer default. 

- Reset to manufacturer default, except for the current network configuration (IP addresses, network mask, default gateway, etc). 

- Reboot the controller with all configuration maintained. 

## 4.4.15 Reports/logs 

The software shall provide separated log files, one for RMS protocol commands and another for any other system logs.  All the logs shall be able to be displayed via the web interface and to be exported to text or CSV format files. 

## 4.4.16 System event logs 

The software should log the following system events as minimum: 

- Controller and sign fault events. 

- RMS protocol connection events (only require connection and disconnection events). 

- The login / logoff events for the browser interface software, including any failure attempts.  The parameters to be logged include the attempted usernames, passwords and source IP addresses. 

The software shall keep a minimum of the last 30 days or 5000 log entries, whichever limit comes first.  Each log shall contain a timestamp with the resolution to 1ms. 

## 4.4.17  RMS command logs 

The software should log every RMS protocol commands and response between the master software and the controller for the last 30 days or 5000 messages.  Each log shall contain: 

- Message direction (from the master to the controller or vice versa). 

- A timestamp with resolution to 1ms (The time the commands received or the response sent). 

Page 17 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

   - The actually message detail in a Hex string. 

- 4.4.18 Non functional requirements 

   - (a) Performance – The software shall respond to every user interaction less than 3 seconds (excluding delays in the network). 

   - (b) Security - 

   - The software shall verify the username and password before granting access to the system. 

   - The software shall support both HTTP and HTTPS and allow a user to choose access mode from ‘HTTP only’, ‘HTTPS only’ and ‘Both HTTP and HTTPS’. 

   - Only TLS shall be used for the HTTPS connection. 

   - The current VicRoads document ‘Information Security Standard: Cryptographic Controls’ shall be complied with. 

   - After three successive failed login attempts, the minimum time allowed between login attempts shall be changed to 60 seconds. 

## (c) Bandwidth /network requirement 

The software shall be designed to run on a relatively slow IP network, such as 3G wireless network with around 500Kbps bandwidth and 500ms latency. The user interface shall be simple to avoid long response times.  Where large amounts of information is to be displayed (such as logs), the information shall be displayed over multiple pages with page down and page up functions. 

## **4.5 RESET** 

- 4.5.1 On reset or reboot of the sign controller and/or VMS (regardless of source), the VMS’s display shall be set to blank. 

- 4.5.2 The sign controller shall incorporate a reset button accessible on the front chassis.  The reset button shall perform a soft reset the SC & Connected VMS.  All configurations within the SC and VMS shall be maintained. 

- 4.5.3 The sign controller shall not be provide any hard reset (reset the controller to manufactory default) mechanism (such as button), which can be accessed via the chassis. 

Page 18 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **4.6 SIGN CONTROLLER PARAMETER DEFAULT SETTINGS** 

- 4.6.1 The default settings for key parameters within the SC shall be as shown in Table 4.1. 

|**Parameter**|**Description**|**Default Setting**|
|---|---|---|
|SC login user name|Username required for access to the SC’s Web<br>based tool|‘Admin’|
|SC login password|Password required for access to the SC’s Web<br>based tool|to be provided by VicRoads.|
|SC Site Name|The SC’s Site name to be displayed in the Web<br>based tool|VicRoads allocated Site<br>Number (RAI ID)|
|SC IP address|Selectable DHCP or statically configurable IP<br>address and Netmask|STATIC<br>IP:<br>192.168.30.1<br>Mask:  255.255.255.0|
|RTA over, TCP/IP|TCP port numbers for RTA/RMS protocol<br>connection|no encryption TCP : 43000<br>TLS encrypted  TCP:43002<br>Default: no encryption|
|Default  RTA address|RTA/RMS Protocol group and sign address|All addresses to start from 1|
|Serial configuration|Hardware serial settings|RS422<br>38400kbps, 8 N 1|
|Web Access Ports|TCP port number used for web access to the<br>Web based tool|HTTP: TCP 80<br>HTTPS using TLS: TCP 443|
|Telnet|TCP port number used for connection to the<br>CLI|TCP 6368|
|Control Mode|Default controller RTA control mode|TCP|
|Luminance Dimming<br>Control Mode|Default Luminance Dimming Control Mode|Auto|
|RTA TCP Time out|Session time out for TCP/IP connection (in<br>seconds)|300|
|RTA serial Time out|Session time out for serial connection (in<br>seconds)|180|
|Blanking Time out|in minutes, the duration that the controller to<br>black the sign after the active RTA/RMS<br>protocol connection is disconnected|5|
|Web Access Timeout|in minutes, the duration that the current Web<br>tool connection to be after the last active web<br>request is received.|5|



**Table 4.1 – Sign controller key parameters** 

Page 19 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **4.7 ETHERNET** 

- 4.7.1 The SC shall provide at least one 10/100 TX Ethernet interface.  The Ethernet interface shall support the modes of communication and protocols detailed in Sections 4.8, 4.9 and 4.10 of this specification. 

- 4.7.2 A Cat6 Ethernet cable shall be used to connect the SC to the network switch.  The length of the Cat6 Ethernet cable shall not exceed 100m. 

## **4.8 RMS PROTOCOL FOR SIGN CONTROL** 

- 4.8.1 The operation of the sign shall be controlled by means of the RMS communications protocol to comply with AS 4852.1 Section 4.5, via the physical serial and the Ethernet interfaces defined above.  This protocol is defined in the RMS specification TSI-SP-003 “Communications Protocol for Roadside Devices” current version 2.1. 

- 4.8.2 Remote control of the sign shall be facilitated via STREAMS. 

- 4.8.3 In order to implement the 4-colour operation of the VMS pictogram element, extensions to the default RMS protocol message suite as defined by VicRoads (provided in Appendix B) will be required.  The RMS specification for this is ITSM-TO-ITS-CSI-002 Colour Sign Interface. 

- 4.8.4 If a controlling device (usually a VicRoads field processor) sends an RMS command which is not supported, then the SC shall reply with a Reject Message with an appropriate Application Error Code as defined in the RMS protocol specification. 

- 4.8.5 The sign controller shall support all fault logging and diagnostic functionality provided by the RMS protocol. 

- 4.8.6 RMS “Heartbeat Poll” messages from the controlling device shall be serviced by the sign controller within 0.5 seconds of reception of the heartbeat request. 

- 4.8.7 The sign controller may also support customised messages for special functions.  In this case, such messages shall be in RMS protocol format and shall be fully documented for integration with 3[rd] party systems. The proposed customised messages shall be provided to VicRoads for review and approval before implementation.  The supplier shall supply full details of any such customised RMS protocol messages for integration with 3[rd] party software vendors. 

- 4.8.8 The sign controller shall fully implement all defined RMS protocol layers including error checking as described in the RMS protocol specification, and with changes as described in Appendix B of this specification. 

## **4.9 OTHER PROTOCOLS** 

- 4.9.1 In addition to standard TCP/IP detailed above, the SC shall support the following protocols as a minimum: 

   - ICMP (ping). 

Page 20 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- NTP (to set & maintain the SC / VMS clocks). 

Note: _The SC shall set its time based on the configured NTP server or the manual input from the admin and configuration interface.  However, once the SC is connected to master software via RMS protocol and if the master software uses the ‘Update Time’ command to update the SC’s time, the SC shall use the time set by the master software until the RMS protocol session is disconnected._ 

   - HTTP (interface for admin and configuration). 

   - HTTP using TLS (secure interface for admin and configuration). 

- 4.9.2 Where encryption is enabled, the SC shall provide a facility to securely upload encryption certificates and/or change the encryption password from a remote location. 

- 4.9.3 Where encryption is enabled, TLS shall be used as the encryption mechanism.  TLS shall be implemented as follows: 

   - The control system shall be the client and the sign is the server. 

   - The focus is on communication privacy and integrity, therefore, neither client nor server authentication is required. 

   - The sign controller shall be able to have a TLS certificate (with private key) uploaded to be used as a server certificate, to be used in the negotiation of a secure TLS/SSL connection. 

   - The sign controller shall perform as a TLS server endpoint and does not need to authenticate the client. 

   - TLS v1.2 shall be supported. 

## **4.10 HARDWARE SERIAL PORTS:** 

- 4.10.1 The SC shall provide a minimum of two hardware serial ports with standard DB-9 connectors. Each of the ports shall correspond to the text and pictogram elements respectively and shall provide control of these sign elements using RMS protocol. 

- 4.10.2 Both of the serial ports shall function in accordance with Table 4.2: 

|**Physical Interface Std.**|**RS422**and**RS485**<br>(autosensing, or software configurable)|
|---|---|
|**Baud Rate**|38400bps – 115200bps|
|**Data bits / stop bits**|Configurable|
|**Parity**|Configurable|



**Table 4.2 – Serial port function** 

Page 21 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **4.11 DIAGNOSTIC FUNCTIONS** 

- 4.11.1 The sign controller shall monitor the fault status of the connected VMS and provide this fault information through appropriate RMS protocol messages.  This fault logging system shall log all events as they occur.  The reporting system shall also buffer reportable events when communication to the sign controller is temporarily lost.  Such buffered events shall be made available to the controlling device when requested upon communications resuming. 

- 4.11.2 Diagnostics functions shall be provided to monitor the text and pictogram VMS display elements, as well as the sign’s internal subsystems.  All diagnostic information and logs shall be accessible using RMS protocol through each of the sign controller’s serial communications interfaces and Ethernet interface. 

4.11.3 As a minimum, the sign controller shall monitor the following: 

   - The loss of communications between the SC and the VMS display elements. 

   - The loss of mains power to the VMS. 

   - Pixel check* results for the connected VMS[‡.] 

   - Sign temperature (i.e. over-heat/cool status). 

   - Ambient light sensor failure. 

   - All other VMS / SC subsystem fault conditions. 

- 4.11.4 Where a standard format for any given fault report is not defined by the RMS protocol, the format shall be fully documented and disclosed to VicRoads for integration with 3[rd] party systems. 

- 4.11.5 All faults shall be detected and logged for reporting within thirty (30) seconds of the fault occurring. 

***** NOTE: _Any LED pixel shall be deemed “faulty” if it does not behave as expected.  Such behaviour shall include pixels remaining in the wrong state (on or off), pixels which flicker, and pixels which exhibit reduced or increased brightness compared to properly functioning pixels._ 

‡ NOTE: _If the pixel check test requires pixels in the sign face to be momentarily lit, then this test shall only be run once per day at any configurable time.  The fault report for this test may also be updated on a daily basis in this case._ 

## **4.12 MONITORING, FAULT LOGGING AND REPORTING** 

- 4.12.1 The control functions of the sign shall be capable of monitoring the operation of the sign in accordance with AS 4852.1 Section 4.6. 

- 4.12.2 The VMS shall automatically respond to faults according to Table 4.3 below. 

Page 22 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

||||**RTA Error**<br>**code to be**<br>**used**|
|---|---|---|---|
||**Failure types**|**Responses**||
|||||
|i.|Where mains power is lost<br>to the SC OR the VMS<br>itself.|<br>The entire display area of the VMS<br>shall be completely blanked.<br><br>Create a log in the SC specifying<br>power failure for affected<br>device(s).|Controller<br>Err Code: 01|
|ii.|Where the communication<br>link to either of the SC’s<br>physical serial ports is lost<br>or adverselyaffected.|<br>The entire display area of the VMS<br>shall be completely blanked.<br><br>Create a log in the SC detailing<br>which serial interface was affected.|Controller<br>Err Code: 02|
|iii.|Where an established<br>communication link over<br>TCP/IP is lost or<br>interrupted.|<br>The entire display area of the VMS<br>shall be completely blanked.<br><br>Create a log in the SC detailing the<br>nature of the link loss.|Controller<br>Err Code: 02|
|iv.|Where the communication<br>between the SC and the<br>VMS itself is lost or<br>adversely affected.|<br>The entire display area of the VMS<br>shall be completely blanked.<br>Create a log in the SC detailing the<br>specific type of communications failure<br>to the VMS sign.|Controller<br>Err Code: 05|
|v.|Where internal faults are<br>detected within the SC<br>and/or VMS itself, i.e.<br>watchdog timeout etc.|<br>The entire display area of the VMS<br>shall be completely blanked.<br><br>Create a log in the SC specifying<br>the nature of the failure.|Error Code<br>from<br>Appendix C<br>of RMS<br>protocol as<br>appropriate|
|vi.|Where 10 percent or more<br>of Led’s in either the<br>pictogram display and/or<br>the text display elements of<br>the VMS have failed OR<br>have become faulty* OR are<br>affected to the extent that<br>the resultant displays may<br>be confusingto thepublic.|<br>The entire display area of the VMS<br>shall be completely blanked.<br><br>Create a log in the SC of the type<br>& extent of the LED failure(s).|Controller<br>Err Code: 08|



**Table 4.3 – Fault Responses** 

## **4.13 LOCAL CONTROL** 

- 4.13.1 The ground level access shall include RS 232 and Ethernet connections and also include a 240V socket outlet with integral RCD. 

- 4.13.2 The Ethernet interface shall provide the sign with: 

   - at least one IEEE 802.3 10/100 BaseTX Ethernet interface with RJ-45 socket connection. 

   - support for DHCP or static IP addressing. 

   - sign management and configuration via Ethernet using SSH or http/https protocol. 

- 4.13.3 The sign shall be capable of being programmed in accordance with AS 4582.1 Section 4.4. 

Page 23 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 4.13.4 The software for local operation shall be capable of the following facilities: 

   - Word wrap. 

   - Auto centring. 

   - Auto placing of text on screen. 

- 4.13.5 The above features shall be incorporated together with all display changing parameters as detailed in Section 3. 

- 4.13.6 The frames and/or message strings produced locally shall be capable of being directly displayed on the sign, over-riding the current scheduled program. 

## **4.14 REMOTE CONTROL** 

- 4.14.1 Standard operation of the sign shall be via a remote system as defined in AS 4852.1, Section 4.3. 

- 4.14.2 The sign controller shall be able to be controlled via either serial connection or Ethernet connection by using RMS protocol. 

- 4.14.3 The communications link between the host computer and the VMS shall be specified in individual tender documents.  Typically, the communications link shall be via fibre-optic cable or the 3G/4G wireless network using compatible modems. 

## **4.15 MANUAL OVERRIDE FACILITY SWITCH CONTROL** 

- 4.15.1 A facility switch shall be provided to enable local, manual override control over the sign display. 

- 4.15.2 The switch shall meet the physical requirements specified in Section 8.5 of this specification. 

- 4.15.3 The switch shall provide for three display modes as detailed in Table 4.4. 

|**OFF**|VMS display completely blank|
|---|---|
|**TEST**|The VMS shall display the chequered test pattern on both the text and<br>pictogram display elements – the pictogram pattern shall consist of 4 colours<br>in accordance with Section 2.18 of this specification.|
|**AUTO**|VMS to operate normally|



## **Table 4.4 – Facility switch positions** 

- 4.15.4 The switch shall only switch extra low voltage. 

- 4.15.5 The switch shall not switch low voltage. 

Page 24 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 4.15.6 The sign controller shall report the current position of the facility switch through a status reporting mechanism using RMS protocol and through the sign controller’s text-based menu (CLI) 

## **4.16 FALL-BACK SYSTEM** 

- 4.16.1 The sign shall incorporate the ability to fall back to a pre-defined operation mode when a major system failure occurs in accordance with AS 4852.1, Section 4.7. 

## **4.17 DISPLAY TEST PATTERNS** 

- 4.17.1 The sign shall be capable of generating test patterns on both the text and pictograms sections of the sign. 

- 4.17.2 The test patterns shall include, as a minimum, the following specified sections showing: 

   - all pixels off; 

   - all pixels on; and 

   - a chequered pattern where no two adjacent pixels are on. 

- 4.17.3 On the pictogram section, the above test patterns shall be cyclically displayed in each of the four colours, one colour at a time.  The transition time between colours shall be 3 seconds. 

## **4.18 FIRMWARE UPGRADE** 

- 4.18.1 The sign controller shall provide a facility to remotely upgrade the firmware of the VMS display elements, and the controller itself. 

- 4.18.2 The upgrade process shall first require the sign controller command line interface password to be correctly entered. 

- 4.18.3 If communication is lost during any firmware upgrade, the device being upgraded shall revert to its previous firmware version and settings automatically without the need to power cycle the device. 

Page 25 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 5** 

## **DISPLAY AND OPTICAL REQUIREMENTS** 

## **5.1 GENERAL** 

- 5.1.1 The general display requirements shall comply with AS 4852.1, Section 3.1.1. 

- 5.1.2 Where a pictogram is specified, it shall comply with Section 4 of this specification. 

- 5.1.3 The symbols generated on the sign shall comply with the requirements of AS 4852.1, Section 3.1.1 and/or layouts approved by VicRoads. 

- 5.1.4 This Section relates to the main text area of the VMS and does not relate to the pictogram area. 

## **5.2 DISPLAYS** 

- 5.2.1 The VMS text display dimensions shall be 30 x 124 (vertical x horizontal) pixels. 

- 5.2.2 If a pictogram display is required, the display dimensions shall be 64x64 pixels. 

- 5.2.3 LED’s shall be arranged in a pixel matrix as specified in AS 4852.1, Section 3.1.4. 

- 5.2.4 The dimension of the housing shall be the minimum practical required to house the display. The dimensions of the entire VMS assembly, including the pictogram section, shall not exceed: 

   - Height: 2.3m. 

   - Width: 10m. 

   - Depth 0.35m. 

## **5.3 SIGN DIMMING CONTROL** 

- 5.3.1 The sign shall have the ability to dim the light output intensity of its display to comply with AS 4852.1, Section 3.1.11. 

- 5.3.2 The supplier shall submit details of the peak normal and dimmed operational loads at the time of tender. 

## **5.4 CHARACTER FORMATS** 

- 5.4.1 Character formats and fonts shall conform to the requirements of AS 4852.1, Section 3.1.5. 

Page 26 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 5.4.2 Standard operation of the sign shall permit the generation of default Font 2 characters. 

- 5.4.3 To enhance the graphical qualities of the display, the individual pixel (element) dimensions shall not be greater than 40mm. 

- 5.4.4 In addition to the standard operation, the sign shall be capable of generating: 

   - double stroke characters; 

   - two lines of Font 4 characters; 

   - one line of Font 5 characters, and 

   - various fonts and proportional spacings. 

## **5.5 DISPLAY CHANGES** 

- 5.5.1 Standard display changing shall comply with AS 4852.1, Section 3.1.6. 

- 5.5.2 The total time for standard display changing shall not be greater than 0.5 seconds.  Successive flashing of any display shall occur at a rate of 0.5 seconds on and 0.5 seconds off. 

## **5.6 OPTICAL REQUIREMENTS** 

## **5.6.1 Photometric Requirements** 

- 5.6.1.1 The photometric requirements shall comply with AS 4852.1, sections 3.2.1 and 3.2.2. 

- 5.6.1.2 The photometric test procedures shall comply with AS 4852.1, Appendix C. 

## **5.6.2 Colormetric Requirements** 

- 5.6.2.1 The colormetric requirements shall comply with AS 4852.1, sections 3.2.3. 

- 5.6.2.2 The colormetric test procedures shall comply with AS 4852.1, Appendix D. 

## **5.6.3 Lifespan Requirements** 

- 5.6.3.1 The lifespan requirements for LED pixels outputs shall be in accordance with Appendix D. 

Page 27 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 6** 

## **COLOUR PICTOGRAM** 

## **6.1 GENERAL** 

- 6.1.1 Where specified in individual tender documents, the sign shall incorporate a pictogram display region mounted to the left of the text area of the sign as shown in Figure 6.1. 

- 6.1.2 The pictogram region shall be a four colour (red, yellow, green and white) display. 

- 6.1.3 The four colours shall be generated using individual red, yellow, green and white LED’s. 

- 6.1.4 The use of a RGB display is not permitted. 

- 6.1.5 As far as practicable, there shall be no visible delineation or border between the pictogram and text regions of the display.  See Figure 6.1. 

**==> picture [433 x 122] intentionally omitted <==**

**==> picture [366 x 37] intentionally omitted <==**

**----- Start of picture text -----**<br>
Four colour<br>Standard display section<br>Pictogram section<br>**----- End of picture text -----**<br>


**Figure 6.1 – Layout of VMS with pictogram** 

- 6.1.6 The pictogram shall operate according to RMS protocol ITSM-TO-ITS-CSI-002 Colour Sign Interface to provide pixel colour outputs of red, yellow, green and white (see Appendix B). 

## **6.2 PICTOGRAM DISPLAY REGION** 

- 6.2.1 The pictogram display region of the sign shall be square in shape with 64 evenly spaced pixels both horizontally and vertically. 

- 6.2.2 The pixels shall have a height to width ratio of 1:1. 

- 6.2.3 The overall height of the pictogram region shall be the same as the text region. 

Page 28 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 6.2.4 The pictogram display shall be capable of displaying traffic conditions for up to three destinations.  A typical display arrangement is shown in Figure 4.1. 

- 6.2.5 The travel times shall be capable of displaying traffic conditions as follows: 

   - Green to indicate light traffic conditions; 

   - Yellow to indicate medium traffic conditions; and 

   - Red to indicate heavy traffic conditions. 

## **6.3 PICTOGRAM OPTICAL REQUIREMENTS** 

## **6.3.1 Photometric Requirements** 

- 6.3.1.1 The photometric requirements shall comply with AS 4852.1, sections 3.2.1 and 3.2.2. 

- 6.3.1.2 The photometric test procedures shall comply with AS 4852.1, Appendix C. 

## **6.3.2 Colormetric Requirements** 

- 6.3.2.1 The colormetric requirements shall comply with AS 4852.1, sections 3.2.3. 

- 6.3.2.2 The colormetric test procedures shall comply with AS 4852.1, Appendix D. 

## **6.3.3 Lifespan Requirements** 

- 6.3.3.1 The lifespan requirements for LED pixels outputs shall be in accordance with Appendix D. 

## **6.4 DISPLAY CHANGES** 

- 6.4.1 The complete sign shall be capable of displaying single frames on: 

   - the text and pictogram regions simultaneously; 

   - the text region only; and 

   - the pictogram region only. 

- 6.4.2 The complete sign shall be capable of displaying multi-frame messages on: 

   - the text and pictogram regions simultaneously; 

   - the text region only; and 

   - the pictogram region only. 

- 6.4.3 Where the text display region and the pictogram region are both displaying a multi-frame message, changing of these frames on both regions shall occur simultaneously.  Such changes shall consist of complete blanking of one frame and display of the next frame (see Appendix B). 

Page 29 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 7** 

## **ELECTRICAL REQUIREMENTS** 

## **7.1 GENERAL** 

- 7.1.1 The electrical system of the sign shall comply with AS 4852.1, Section 2.2. 

- 7.1.2 Transformers used within the sign and/or sign control system shall comply with AS 61588. 

- 7.1.3 All cables and wires shall be insulated with a material not inferior to V-90 grade PVC and shall be suitably labelled. 

- 7.1.4 The display modules and associated driver network and the control and communications equipment shall operate at extra low voltage (ELV). 

- 7.1.5 The electrical system shall incorporate the following facilities: 

   - A main switchboard located within the ground level Sign Controller cabinet to include a mains switch, a circuit breaker to protect the expected load of the complete VMS and a double socket outlet with integrated RCD. 

   - A sub-switchboard located within the VMS enclosure with a mains switch, a separate circuit breaker for each individual 240 volt circuit within the VMS. 

   - The VMS enclosure shall include as many socket outlets as is required for normal VMS operation, plus one extra double socket outlet for maintenance use.  Each socket outlet shall include an integrated RCD. 

## **7.2 OPERATING VOLTAGE** 

- 7.2.1 The mains supply voltage shall be deemed to be 230Vac +10%, -6% in accordance with AS 60038 Section 2.  The system and or sub-elements of the system shall be capable of operating satisfactorily from the same within ± 15 %. 

## **7.3 POWER** 

- 7.3.1 The supplier shall submit the following details of the power load of each individual sign: 

   - a) normal peak operation; 

   - b) dimmed operation; and 

   - c) in rush current at switch on. 

Page 30 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **7.4 BATTERY BACK-UP** 

- 7.4.1 A battery back-up system shall be provided with each sign in accordance with AS 4852.1, Section 2.2.3. 

## **7.5 INTERNAL PROTECTION** 

- 7.5.1 All equipment including data lines shall be internally protected against damage resulting from: 

   - Lightning strikes at or near the sign/gantry. 

   - Electrical transients on power cabling. 

   - Electrical transients on communications wiring. 

   - Radio frequency interference. 

   - Static electrical discharge. 

   - Any harmonics arising from the above and any equipment in the cabinet. 

## **7.6 EMC COMPLIANCE** 

- 7.6.1 All equipment covered by this specification shall comply with Clause 5.5 of AS 5156. 

- 7.6.2 It should also comply with the relevant requirements of the Australian Communications and Media Authority (ACMA) for EMC and shall be labelled with a conforming RCM compliance label as shown in Figure 5. 

**==> picture [192 x 109] intentionally omitted <==**

` **Figure 5 - RCM compliance label** 

## **7.7 SOCKET OUTLETS** 

- 7.7.1 Terminal strips are the preferred connecting arrangement for power distribution to the signs internal components. 

- 7.7.2 Where socket outlets are used to distribute power amongst the signs internal components, a suitable retaining arrangement shall be used to ensure that the plug-top cannot come loose from the socket outlet in normal operation. 

Page 31 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 8 MECHANICAL AND PHYSICAL REQUIREMENTS** 

## **8.1 GENERAL** 

- 8.1.1 The materials, durability and lifespan requirements shall comply with AS 4852.1, Sections 2.1.1 and 2.1.2. 

- 8.1.2 The design and construction of all structural steel work shall be carried out in accordance with the requirements of AS 4100. 

- 8.1.3 The internal components of the sign, such as pixel display modules, control units and heating and cooling equipment shall be arranged in modules of a size capable of being removed and re-installed in-situ by hand from the access walkway.  The construction and layout of the cabinet, framework and electronic driver networks should facilitate this requirement. 

## **8.2 SIGN ENCLOSURE** 

- 8.2.1 The general construction requirements for the sign shall comply with AS 4852.1, Section 2.1.2. 

- 8.2.2 Where the design does not incorporate a covering window, details regarding matrix sealing, cleaning and other pertinent matters shall be provided by the supplier at tender. 

- 8.2.3 Access to all internal components shall be provided by door(s) in compliance with AS 4852.1, Section 2.1.2. 

- 8.2.4 The rear of the sign enclosure shall be matt grey or matt black. 

## **8.3 SIGN SUPPORT STRUCTURE AND ASSOCIATED FOOTING** 

- 8.3.1 The sign support structure and associated footing shall comply with: 

   - AS 4852.1, Section 2.1.3; 

   - Bridge Technical Note BTN 2010 /001 – November 2010 Design of Steel Cantilever and Portal Sign Structures and High-Mast Light Poles (refer to the below link); ~ - 

   - https://www.vicroads.vic.gov.au/ /media/files/technicaldocuments/specifications/bridge technical-note-2010001v11.ashx 

   - AS 5100 Bridge Design. 

- 8.3.2 In case of discrepancy, the Bridge Technical Note BTN 2010/001 – November 2010 will take precedence over AS 4852. 

Page 32 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 8.3.3 Unless otherwise specified in individual tender documents, the sign shall be mounted using one of the following methods: 

   - mounted on an overhead gantry; or 

   - mounted on a suitably designed single or double column. 

- 8.3.4 Where the sign is mounted on and overhead gantry: 

   - Access will be provided via the gantry. 

   - No separate walkway or platform will be required. 

- 8.3.5 Where the sign is mounted on a single or double column: 

   - The sign support structure shall provide a walkway and platform for access to the rear side of the installed sign in compliance with AS 4852.1, Section 2.1.3. 

   - The sign shall be mounted directly onto the support structure and shall be secured through the base of the sign. 

   - A mower strip not less than 0.5 metres larger than the base projection of the support column shall be installed around the base of the column(s). 

- 8.3.6 All power supply, control and communication cabling shall be routed through the centre of a column and shall enter the sign enclosure through appropriately constructed and sealed entry holes. 

- 8.3.7 The VMS mounting infrastructure shall provide a rear safety access platform suitably located to provide standing access to the integral components.  The platform shall not be accessible from ground level without the use of a ladder, steps, cherry picker or similar device. 

## **8.4 SIGN CONTROLLER HOUSING** 

- 8.4.1 The sign controller housing shall conform to the requirements of AS 4852.1, clause 2.1.4. 

- 8.4.2  All fixing hardware shall be rust proof and shall not cause galvanic corrosion between the fasteners, rack chassis and the housing. 

- 8.4.3 The sign controller shall be able to operate continuously at ambient temperatures ranging from -10°C to 60°C at 95% relative humidity (non-condensing). 

- 8.4.4 A mower strip, not less than 0.5 metres larger than the base projection of the control housing, shall be installed around the base of the housing. 

## **8.5 FACILITY SWITCH** 

- 8.5.1 A facility switch shall be provided as detailed in Section 4.15 of this specification. 

- 8.5.2 The switch and key shall comply with the requirements of Clause 2.7.1 of AS 2578-2009 Traffic signal controllers. 

Page 33 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- 8.5.3 The switch shall be mounted within the front face of the sign controller, internally of the cabinet or within its own 19” rack mounted unit no more than 1 RU in height. 

- 8.5.4 Each position of the facility switch shall be indelibly and durably labelled as per Figure 8.1. The labels shall align with the matching key position to within +/- 10deg. 

**==> picture [245 x 137] intentionally omitted <==**

**----- Start of picture text -----**<br>
OFF<br>TEST  AUTO<br>**----- End of picture text -----**<br>


**Figure 8.1 – Facility switch relative positions and labelling** 

## **8.6 MARKINGS AND LABELS** 

- 8.6.1 All markings shall be clear, permanent and weatherproof and shall include all the information specified in AS 4852.1, Section 2.5. 

Page 34 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 9 ENVIRONMENTAL** 

## **9.1 GENERAL** 

- 9.1.1 The sign and all associated equipment shall comply with the environmental requirements specified in AS 4852.1, Section 5. 

## **9.2 ELECTROMAGNETIC COMPATIBILITY (EMC)** 

- 9.2.1 The sign and all associated equipment shall comply with the electromagnetic immunity requirements specified in AS 4852.1, Section 5.4.1. 

- 9.2.2 The sign and all associated equipment shall comply with the relevant requirements of AS 61000.6.3 for emissions. 

Page 35 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 10 MARKINGS** 

## **10.1 MARKINGS** 

- 10.1.1 Every VMS shall be legibly and durably marked, on an interior surface, with all the information as specified in Clause 2.5 of AS 4852.1. 

- 10.1.2 Every VMS shall be legibly and durably marked, on the rear of the sign enclosure, with all the information as specified in Clause 2.5 of AS 4852.1. 

Page 36 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **SECTION 11 DOCUMENTATION** 

## **11.1 DOCUMENTATION** 

11.1.1 The following shall be supplied with every VMS in both hard copy and soft copy: 

- (a) Overview of the sign design and layout. 

- (b) Overview of the sign software. (c) Full documentation of the sign software and firmware. 

- (d) Structural drawings. (e) Complete wiring diagrams. 

- (f) List of all major components and sub-components. 

- (g) Operation and maintenance manual including routine maintenance requirements and fault finding methodology. 

- (h) Proposed maintenance plan. (i) Recommended list of spare parts for maintenance. 

Page 37 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **APPENDIX A** 

## **VICROADS ITS PLATFORM** 

(Informative) 

## **A1 GENERAL** 

- A1.1 VicRoads ITS platform currently uses the STREAMS system. 

- A1.2 STREAMS is owned and maintained by Transmax, a Queensland based company which is part of Queensland Main Roads. 

- A1.3 STREAMS is an integrated control system which is being used by VicRoads to operate ITS Freeway Management Devices on it’s freeway network. 

- A1.4 All ITS field devices must be compatible with STREAMS. 

- A1.5 Typical ITS field devices connected to and operated by STREAMS include: 

   - Variable Message Signs (VMS) 

   - Freeway Data Stations (FDS) 

   - Ramp metering/control signs 

   - Lane Control Signs (LCS) 

- A1.6 The above devices are typically connected to STREAMS via a Field Processor (FP). 

## **A2 FIELD PROCESSOR** 

- A2.1 The FP is used to interface internet protocol (IP) and serially connected field devices to STREAMS. 

- A2.2 Communications between the FP and the ITS Field Device is typically RMS protocol. 

- A2.3 The FP is typically installed within an ITS Field Cabinet. 

- A2.4 The ITS Field Cabinet is typically located adjacent to the freeway. 

- A2.5 In some situations, the FP may be located in the VicRoads building at Kew. 

Page 38 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **APPENDIX B** 

## **VICROADS EXTENSION TO RMS PROTOCOL FOR VMS** 

(Normative) 

## **B1 INTRODUCTION** 

- B1.1 This appendix defines requirements for sign controllers to implement RMS protocol (TSI-SP003 ver2.1) as the communication protocol between Variable Message Signs and the VicRoads ITS Central Control System.  Note that the protocol used by VicRoads is based on v2.1 of TSI-SP-003 instead of the newer version 3.1. 

- B1.2 The definitions for handling colour is based on an RMS protocol document (ITSM-TO-ITSCSI-002) that describes the extensions to the base RMS protocol. 

## **B2 GENERAL IMPLEMENTATION REQUIREMENTS** 

- B2.1 Sign controllers shall utilise RMS Protocol (previous known as ‘RTA protocol’) - ‘Communication Protocol For Roadside Devices’ Specification No. TSI-SP-003 version 2.1 as the communication protocol for STREAMS to monitor and control the signs. 

- B2.2 The sign controller shall fully implement all defined protocol layers as described in the RMS protocol with following exceptions: 

   - The serial connection defined in section 3.2 Physical Link and section 3.3 is not the only valid physical link.  The sign controller shall also support running RMS protocol over Ethernet via a TCP/IP Socket.  When Ethernet is being used, the sign controller shall run as a TCP/IP Socket server and the VicRoads Central Control System will run as TCP/IP Socket client. 

   - For security reasons, the sign controller shall support RMS protocol messages being transmitted with no encryption or encrypted with TLS. 

   - The current VicRoads ‘Information Security Standard: Cryptographic Controls’ shall be complied with. 

   - Application messages for HAR and Weather Systems (MI code 40-48 and 80-87) defined in the protocol are not required to be implemented. 

## B2.3 CRC calculation. 

There are two places in the protocol requires CRC calculation. 

- CRC calculation is required for every message as a part of the full data packets, which is defined in the protocol section 3.3.2.3. **Note** : Transmitted data (i.e. ASCII-HEX encoded data as defined in section 3.3.1) is to be used for this CRC calculation. 

- CRC calculation is also required for some of the Application Layer messages, such as ‘sign set text frame’ and ‘Sign set graphics frame’. **Note** : Message data (i.e. Not ASCIIHEX encoded data) is to be used for this CRC calculation. 

Page 39 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

Example: 

The message example in Appendix D of the protocol contains both application message level CRC and data packet level CRC. 

Here is the message in Hex (before ASCII-HEX encoded) 

   - <SOH>00 00 02<STX> 0A 4A 08 05 03 01 09 53 4C 4F 57 20 44 4F 57 4E C8 B7 BE 44 <ETX> 

      - C8B7 is the application message CRC, which is calculated on other hex data in the same application message, i.e. “0A 4A 08 05 03 01 09 53 4C 4F 57 20 44 4F 57 4E”, total 16 bytes. 

      - BE44 is the data packet CRC, which is calculated on ASCII-HEX encoded data in the packet except the <ETX> control byte and the CRC bytes them self, i.e. “<SOH>00 00 02<STX> 0A 4A 08 05 03 01 09 53 4C 4F 57 20 44 4F 57 4E C8 B7” convert to ASCII-HEX, which is “01 30 30 30 30 30 32 02 30 41 34 41 30 38 30 35 30 33 30 31 30 39 35 33 34 43 34 46 35 37 32 30 34 34 34 46 35 37 34 45 43 38 42 37”, total 44 bytes. (<SOH> & <STX> are control characters, not required to be ASCII-HEX encoded) 

- B2.4 Further to section 3.5 of that protocol specification, here is another message exchange example: 

Page 40 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

||**System to Sign**<br>**Controller**|**Sign Controller to System**|**Notes**|
|---|---|---|---|
|||||
|||||
|1|START SESSION|ACK<br>Password seed|Request to start session<br>from central system to sign|
|2|PASSWORD<br>(N(S)=0,<br>N(R)=0)|ACK (N(R)=0)<br>Acknowledge<br>(N(S)=0,<br>N(R)=0)|Password accepted, link<br>established, sign is online|
|3|Heartbeat Poll<br>(N(S)=0, N(R)=0)|ACK(N(R)=1)<br>Status<br>reply<br>(N(S)=0,<br>N(R)=1)||
|4|Extended Status Request<br>(N(S)=1, N(R)=1)|ACK(N(R)=2)<br>Extended Status Reply<br>(N(S)=1, N(R)=2)||
|5|Heartbeat Poll<br>(N(S)=2, N(R)=3)|NAK(N(R)=2)|Incorrect N(R) sent by<br>system to sign results in a<br>NAK|
|6|Heartbeat Poll<br>(N(S)=2, N(R)=2)|ACK(N(R)=3)<br>Status<br>reply<br>(N(S)=2,<br>N(R)=3)|Corrected|
|7|Heartbeat Poll<br>(N(S)=4, N(R)=3)|NAK(N(R)=3)|Incorrect N(S) sent by<br>system results in a NAK|
|8|Heartbeat Poll<br>(N(S)=3, N(R)=3)|ACK(N(R)=4)<br>Status<br>reply<br>(N(S)=3,<br>N(R)=4)||
|9|End<br>session<br>(N(S)=4,<br>N(R)=4)|ACK(N(R)=5)<br>Acknowledge<br>(N(S)=4,<br>N(R)=5)|Sign is offline|



**Message exchange example** 

Page 41 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- B2.5 Usage of ‘revision’ field in Application Layer Messages. 

There is a ‘Revision’ field in some of the Application Layer messages, such as ‘Sign Set Text Frame’ and ‘Sign Set Graphics Frame’.  It is valid for the VicRoads Central Control System not to update this field value when sending those messages to the sign controller i.e, the VicRoads Central Control System can use ‘0’ as the ‘Revision’ field value. 

- B2.6 VicRoads Variable Message Signs are to be interpreted as ‘graphics Signs’ when using the protocol. 

For example, when the sign controller sends message ‘Sign Extended Status Reply’, ‘number of rows/columns of pixels’ shall be returned for fields of message position 25 and 26. 

- B2.7 When the current session ends, the sign(s) should be blank. 

## **B3 SPECIFIC IMPLEMENTATION FOR FREEWAY VMS WITH TWO DISPLAY REGIONS** 

- B3.1 This section defines the specific requirements for implementing RMS protocol for Freeway VMS with two regions – a pictogram display region and a text display region. 

- B3.2 RMS protocol TSI-SP-003 does not include support for one sign controller that is connected to a sign with two display regions that have different pixel dimensions.  To continue using TSI-SP-003, new messages are proposed to be added to the RMS protocol to handle this type of sign referred to as a “composite sign”. 

- B3.3 There are two specific requirements: 

   - a) In general, both regions (the pictogram region and the text region) shall be in sync operating as one large message sign. i.e. where the text display region and the pictogram region are both displaying a multi-frame message, the timing of the display of individual frames on both regions shall occur simultaneously. 

   - b) If the number of frames, transition times or frame display times are different between the pictogram and the text region, the synchronisation does not apply. 

B3.4 New protocol messages for composite VMS 

The following three new messages are proposed to support freeway composite VMS that have two display regions, a pictogram and a text region.  For these new messages, a sign ID of 1 refers to the pictogram region, and an ID of 2 refers to the text region. 

## _B3.4.1 Sign Set Composite Graphics Frame_ 

This new message is identical to the RMS message Sign Set Graphics Frame (MI code 0x0B) from the document TSI-SP-003, except for the addition of the sign ID field.  This message defines a frame for either the pictogram or the text region (for monochrome regions). 

Page 42 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

|||||
|---|---|---|---|
|**Position**|**Bytes**|**Value**|**Description**|
|||||
|1|1|MICode|E0h|
|2|1|BYTE|Frame ID – identifies the frame as it is<br>stored in the sign controller’s memory|
|3|1|BYTE|Revision - identifies the modification level<br>of the frame|
|4|1|BYTE|Sign ID|
|5|1|BYTE|Number of rows ofpixels in sign|
|6|1|BYTE|Number of columns ofpixels in sign|
|7|1|BYTE|Colour|
|8|1|BYTE|Conspicuitydevices|
|9|2|WORD|Length ofgraphics frame in bytes|
|11|Variable|BYTE|Graphics frame|
|...|2|WORD|Message CRC - calculated for all the<br>bytes in the application message|



## _B3.4.2 Sign Set Composite Colour Frame_ 

This new message is identical to the RMS message Sign Set Colour Frame (MI code 0x1D) from the document RMS Colour ITSM-CSI-002, except for the addition of the sign ID field. This message defines a colour frame for either the pictogram or the text region. 

|||||
|---|---|---|---|
|**Position**|**Bytes**|**Value**|**Description**|
|||||
|1|1|MICode|E1h|
|2|1|BYTE|Frame ID – identifies the frame as it is<br>stored in the sign controller’s memory|
|3|1|BYTE|Revision - identifies the modification level<br>of the frame|
|4|1|BYTE|Sign ID|
|5|1|BYTE|Number of rows ofpixels in sign|
|6|1|BYTE|Number of columns ofpixels in sign|
|7|1|BYTE|Colour(red =1, green=2,blue=5)|
|8|1|BYTE|Conspicuitydevices|
|9|2|WORD|Length ofgraphics frame in bytes|
|11|Variable|BYTE|Graphics frame|
|...|2|WORD|Message CRC - calculated for all the<br>bytes in the application message|



Page 43 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## _B3.4.3 Sign Set Composite Message_ 

This new message is to define a display message to be stored in the sign controller’s memory. It is similar to the RMS message “Sign Set Message”, MI code 0x0C). 

|||||
|---|---|---|---|
|**Position**|**Bytes**|**Value**|**Description**|
|||||
|1|1|MICode|E2h|
|2|1|BYTE|Message ID – identifies the message as it is<br>stored in the sign controller’s memory|
|3|1|BYTE|revision - identifies the modification level<br>of the frame|
|4|1|BYTE|*Sign ID|
|5|1|BYTE|*transition time between frames (in<br>seconds x 0.01)|
|6|1|BYTE|*Number of frame definitions (frame ID<br>and frameONtime)|
|7|1|BYTE|*frame ID|
|8|1|BYTE|*frame ON time(in seconds x 0.1)|



_*field may be repeated depending on the number of signs attached to the sign controller_ 

_** field may be repeated depending on the number of frames in the message for a particular sign ID_ 

The master software may define frames for only some of the signs that are attached to this sign controller.  For example, only frames for the text region (sign ID 2) may be defined in a composite message.  In this case, when a sign display message is requested, the sign controller will only display frames for the text region and blank the pictogram region (if a message was previously displayed). 

In general, whenever a message is defined with frames for only some of the signs attached to this sign controller, the sign controller shall blank all the other signs that have no frames defined. 

The following dot points from RMS -TSI-SP003 for Sign Set Message, section 3.6.3.13, also apply to this message definition, with changes as noted below. 

- Message number 00 Hex cannot be changed and always means to reinstate the display from the current active plan or blank the sign if no plan is active 

- A non-zero transition time shall cause a blanking of the complete display. Frames which are permanently on shall also be blanked. 

- A message must contain at least one frame definition. A **sign ID** number of zero indicates that no more sign/frames (ID numbers and ON times) follow within the message. This allows a message to consist of only definitions for some regions of the sign. 

- Length errors shall be reported by the sign controller where a message has no frame definitions or when a message is terminated by zero and further frames are defined afterwards. 

Page 44 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## B3.5 Error handling 

- a) The sign controller shall respond with error code 08 “MI Code not supported by device controller” for the following RMS protocol messages as they do not define a sign ID. 

   - Sign Set Graphics Frame (MI code 0x0B) 

   - Sign Set Message (MI code 0x0C) 

   - Sign Set Colour Frame (MI code 0x1D, from document RMS Colour ITSM-CSI-002) 

- b) When one or both regions fail and need to be blanked as specified in TCS-015, the Sign Controller shall ensure: 

   - If both regions are failed, not to display any messages on either region; 

   - If the pictogram region is failed but the text region is working, continue to display the message on the text region; 

   - If the pictogram region is working, but the text region is failed, not to display any messages on either region. 

Note, in this situation, the master software may still send non-blank sign display commands to the sign controller, the sign controller shall decide to accept or reject the display commands based on the above requirements. 

For the definition of ‘failed’ here, refer to Table 2.5 in section 2 of this document. 

- B3.6 Other requirements/notes 

   - a) B3.6.1 The protocol message ‘Sign display frame’ is not required to be implemented. The sign controller shall send back a ‘Reject’ response with error code ‘08h - MI Code not supported by device controller’. 

   - b) Only Messages (not frames) can be defined in ‘Set Set Plan’ command, otherwise the sign controller shall send back a ‘Reject’ response with error code ‘02h –Syntax error in command’. 

   - c) The sign controller is not required to respond to ‘Sign Request Stored frame/Message/Plan’ commands as specified in RMS protocol. The sign controller shall send back a ‘Reject’ response with error code ‘08h - MI Code not supported by device controller’. 

   - d) From the comments portion of the ‘Sign Set Message’ definition in the RMS protocol, dot points 4, 5, 6 & 8 are not required to be implemented. 

## **B4 SPECIFIC IMPLEMENTATION REQUIREMENTS FOR COLOUR DISPLAYS** 

- B4.1 This section describes the VicRoads implementation of the protocol used to interface with variable message signs that can display multi-colour messages. 

Page 45 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- B4.2 The protocol is based on the RMS protocol document ITSM-TO-ITS-CSI-002 that describes the extensions to the original protocol document for signs (RMS TSI-SP-003). 

- B4.3 The extensions to the protocol allow a multi-colour frame to be uploaded to a variable message sign.  All other messages remain the same, and the sequence for displaying messages also remain the same.  These extensions also limit the colours to be specified to these seven. 

   - Red 

   - Green 

   - Blue 

   - Red + green = yellow 

   - Red + blue = magenta 

   - Green + blue = cyan 

   - Red + green + blue = white 

## B4.4 MESSAGE SEQUENCE AND PROCESS 

As defined in the RTA protocol document, the sign will accept a new message, Sign Set Colour Frame, opcode 0x1D (“Colour” spelling is as per RMS) that will be used to specify a colour frame to the sign.  As per the document: “Setting a multiple colour frame is done by setting three frames where each frame specifies a basic colour.” 

The implications of this process are as follows: 

- If a particular colour is not supported by the sign, then the sign should return error “0x0c – Colour not supported by sign controller” (refer: TSI-SP-003) 

- In order to use a colour graphic frame, all three colour frames must be set before that frame is used, for example in a “Sign Set Message” command.  If a frame is attempted to be used before all three colour frames are set, the sign should return an error “0x13 – Frame, message or plan undefined” 

- The sign should use the colour mixing formulas as above to determine what colour each sign pixel is. 

- The sequence and timing of the definition of each colour frame is not important as long as all three frames are defined in a “Set Colour Frame” before that frame is used. 

## B4.5 COLOUR AND MONOCHROME FRAMES 

- a) The sign should not require or designate any particular frame to be colour or monochrome.  A frame can change between colour and monochrome depending on the last graphic frame definition message. 

(Note: monochrome frames can have colour, but only one colour for all lit pixels) 

- b) If the most recent frame definition message is “Sign Set Graphics Frame” (opcode 0xbh), then that frame becomes a monochrome frame for message display purposes.  Similarly, if a “Sign Set Colour Frame” message is set for that same frame, then it becomes a colour frame, and will require all three frame colours to be defined before it can be used. 

Page 46 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **APPENDIX C** 

## **GENERAL REQUIREMENTS FOR TESTING** 

(Normative) 

## **C1 TEST FACILITY** 

- C1.1 The photometric, colorimetric and environmental testing shall be carried out at a test house that has NATA accreditation for those tests. 

## **C2 TEST PROCEDURE** 

- C2.1 Photometric testing shall be carried out in accordance with Appendix C of AS 4852.1. 

- C2.2 Colorimetric testing shall be carried out in accordance with Appendix D of AS 4852.1. 

- C2.3 The supplier shall submit the results of testing to demonstrate compliance with the environmental requirements detailed in clauses 5.2 and 5.4 of AS 4852.1. 

- C2.4 The supplier may be required to submit test reports to demonstrate compliance with other requirements of this specification. 

Page 47 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **APPENDIX D** 

## **LIFETIME PERFORMANCE REQUIREMENTS** 

(Informative) 

## **D1 SCOPE** 

- D1.1 The purpose of this test is to ensure that the degradation of the VMS unit is within acceptable limits.  The test is designed to measure the deterioration in performance of the optical properties of the active elements as well as the deterioration in the optical properties of any transparent protective cover. 

## **D2 REQUIREMENTS** 

- D2.1 The requirements are that: 

   - after 12 months operation in the field, the VMS shall demonstrate an optical performance as described in Clause 5.6 and 6.3 (as applicable) that is not less that 95% of the values determined at its initial compliance testing; 

   - after 36 months operation in the field, the VMS shall demonstrate an optical performance as described in Clause 5.6 and 6.3 (as applicable) that is not less that 85% of the values determined at its initial compliance testing. 

## **D3 SAMPLE PREPARATION** 

- D3.1 The sample provided at the time of the initial compliance testing will be taken and located outdoors in the same position as its intended use in the field.  This will then be left to weather for 12 months.  The intention is that the transparent protective cover be exposed to similar weathering conditions as the initially compliant VMS placed in the field.  Consequently, it is not necessary that the discrete element module, initially provided in the casing, remains in the casing for the weathering exposure periods. 

- D3.2 After the initially compliant sign has been operating in the field for 12 months, a module is selected from the sign face and removed.  This module is then placed in the weathered casing and the tests carried out as described in Clause 5.6 and 6.3 (as applicable). 

- D3.3 The casing is then placed outdoors again to continue weathering for a further 24 months, i.e. a total of 36 months. 

- D3.4 After the initially compliant sign has been operating in the field for 36 months, a module is selected from the sign face and removed (not the module that replaced the one that was removed at the 12 months period).   This module is then placed in the casing which has now been weathered for 36 months and the tests carried out as described in Clause 5.6 and 6.3 (as applicable). 

Page 48 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

- D3.5 All tests shall be carried out on a sample test area not less than 100mm in diameter in accordance with Figure D1. 

**==> picture [417 x 577] intentionally omitted <==**

## **Figure D1 – 100mm diameter test area** 

Page 49 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **APPENDIX E** 

## **REQUIREMENTS FOR APPROVAL** 

(Informative) 

## **E1. GENERAL** 

- E1.1 Variable Message Signs shall not be subject to standard evaluation procedures associated with formal Type Approval.  Rather, VMS shall be subject to acceptance on a tender by tender basis.  That is, the Supplier shall demonstrate to VicRoads satisfaction that the VMS complies with this specification. 

- E.1.2 To enable assessment for the purpose of granting acceptance, the Supplier is to submit the following with the tender documentation: 

   - An outline drawing showing the general presentation and overall dimensions of the complete Sign 

   - Documentation to demonstrate that the Sign conforms to the requirements of VicRoads Specification.  This may be by means of submitting test results from approved and appropriately qualified independent testing organisations, or providing the manufacturer’s assurance that the product complies with each paragraph of the specification. 

## **E2. REQUIRED NATA ACCREDITED TESTING** 

- E2.1 Not withstanding E1 above, the supplier shall submit test results from a NATA accredited testing organisation to demonstrate compliance with the following: 

## **From this document:** 

Section 5.6.1 Photometric Requirements Section 5.6.2 Colorimetric Requirements Section 6.3.1 Photometric Requirements for Pictogram (where specified) Section 6.3.2 Colorimetric Requirements for Pictogram (where specified) Section 9.2.2 Electromagnetic Compatibility (EMC) - Emissions 

## **From AS 4852.1 Variable message signs, Part 1: Fixed signs** 

Section 5.1 Temperature and Humidity Section 5.2 IP Rating Section 5.4.1 Electromagnetic Compatibility (EMC) – Immunity 

Page 50 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **E3. OTHER REQUIRED TESTING** 

- E3.1 VicRoads may require additional information or testing to be carried out as part of its evaluation of the product. 

## **E4. COMPATIBILTY WITH RMS PROTOCOL** 

- E4.1 The supplier shall provide evidence of compatibility with RMS protocols TSI-SP-003 and ITSM-TO-ITS-CSI-002. 

## **E5. STREAMS COMPATIBILTY** 

- E5.1 The supplier shall provide evidence of compatibility with STREAMS. 

## **E6. ASSESSMENT PROCEDURE** 

- E6.1 The assessment procedure for a Variable Message Sign will include, but not be limited to, the following: 

   - Assessment of construction, workmanship and critical dimensions; 

   - Evaluation of the submitted data against the requirements of the specification; 

   - Operation of the sign using the manufacturer’s software. 

- E6.2 Where some of these procedures have been completed prior to formal submission, the results will be considered in the evaluation, provided there is no relevant change in the design.  The supplier is to state whether tests carried out prior to formal submission were carried out on an identical sample. 

Page 51 of 52 

Variable Message Signs 

TCS 015 - 2016 

Rev. A 

**==> picture [50 x 12] intentionally omitted <==**

## **APPENDIX F** 

## **GUIDELINES FOR PURCHASING AND INSTALLATION** 

(Informative) 

## **F1. DETAILS TO BE CONSIDERED AND/OR INCLUDED WHEN TENDERING** 

F1.1 When tendering, the following details should be considered and included in the tender document as required: 

- Is the sign required to include a pictogram area?  Does the pictogram area require colour? 

- Is a ground cabinet required for the Sign Controller or is it intended to be installed within an existing ITS Field Cabinet? 

- Is the sign to be installed on existing gantry or supplied with support column(s). 

- Proof engineering if intended to be installed on support column. 

- The point of supply – Is the Contractor required to supply and install the mains supply including cable, conduits, pits, circuit breakers and connections from the nominated point of supply to the VMS housings or is this to be undertaken by others. 

- The communications line - Is the Contractor required to supply and install the communications lines or is this to be undertaken by others. 

- The installation of guard rail if required. 

- The installation of a CCTV camera if required (recommended). 

- The supply and installation of stickers on each VMS and/or the support structure, in accordance with either standard drawing TC-2100 for Standard Cabinet Label or standard drawing TC-2105 for Pedestal Controller Label, displaying the site number. 

- Lifetime performance testing if required. 

## **F2. DOCUMENTATION** 

F2.1 The contractor shall be required to provide, as a minimum, the following documentation with the tender submission: 

- Details of the calculated maximum demand of the Variable Message Sign. 

- Details of to the technologies proposed to be used in the display elements including optical/photometric and life performance details of the proposed technology to be used. 

- Documentation required under Appendix E of this specification to demonstrate compliance with this specification. 

- Documentation required by Section 11 of this specification. 

Page 52 of 52 

Variable Message Signs 

