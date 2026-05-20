**==> picture [595 x 513] intentionally omitted <==**

## **Traffic Engineering Manual** 

Volume 3 – Additional Network Standards and Guidelines Part 2.22 

**Temporary Traffic Management on Managed Motorways** Edition 1.0, November 2022 

## **Traffic Engineering Manual Volume 3** 

## **Additional Traffic Engineering Standards and Guidelines** 

## **Document purpose** 

This document is a Department of Transport (DoT) Additional Traffic Engineering Standards and Guidelines document. 

The aim of this document is to provide practitioners guidance on a topic not covered (or not covered sufficiently) by other national or state standards and guidelines. 

Practitioners are advised that guidance in this document be followed in order to achieve best practice outcomes. 

## **Document hierarchy** 

This document has been published as a _Guideline_ in DoT’s document hierarchy. A _Guideline_ contains relevant engineering knowledge which MUST be acknowledged and considered by a practitioner. 

Where information contained in this guideline cannot be followed, the practitioner should seek technical advice from DoT and gain acceptance (where necessary) for a departure from the content in this guideline. 

## **Document information and revision history** 

Further document information and revision history can be found at the end of this document. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

2 

## **CONTENTS** 

|**1**|**INTRODUCTION ................................................................................................... 5**|**INTRODUCTION ................................................................................................... 5**|
|---|---|---|
|1.1|Background and purpose ............................................................................................................ 5||
|1.2|Application of this document ....................................................................................................... 5||
||1.2.1|Applicable road types ..................................................................................................... 5|
||1.2.2|Applicability to mobile works .......................................................................................... 6|
||1.2.3|Applicability to long and short-term works ...................................................................... 6|
|1.3|Safe|system approach ................................................................................................................ 6|
|**2**|**OVERVIEW OF MANAGED MOTORWAYS ......................................................... 8**||
|2.1|Background ................................................................................................................................. 8||
||2.1.1|Elements of the Managed Motorway Toolkit .................................................................. 9|
||2.1.2|Continued Expansion of LUMS Control across the Motorway Network ....................... 12|
||2.1.3|Traffic Operations Centre ............................................................................................. 12|
|_2.2_|Functionality of STREAMS ....................................................................................................... 13||
||2.2.1|Fundamental display rules ........................................................................................... 13|
||2.2.2|Sequencing rules .......................................................................................................... 14|
|2.3|Limitations and restrictions ....................................................................................................... 16||
||2.3.1|System faults / outages ................................................................................................ 16|
||2.3.2|Shoulders ..................................................................................................................... 16|
||2.3.3|Separation of worksites ................................................................................................ 16|
||2.3.4|Coordination of Multiple Work Zones or Incident Response ........................................ 16|
|**3**|**PLANNING AND APPROVALS PHASE ............................................................. 17**||
|3.1|Hierarchy of control ................................................................................................................... 17||
|3.2|Planning and design ................................................................................................................. 17||
||3.2.1|Site investigation .......................................................................................................... 17|
||3.2.2|Planning stage risk assessment ................................................................................... 18|
||3.2.3|Site-specific TMP requirements ................................................................................... 18|
||3.2.4|Design requirements – on-road signage ...................................................................... 19|
||3.2.5|Design requirements – LUMS and VMS ...................................................................... 20|
||3.2.6|Design requirements – Works near Road Safety Cameras ......................................... 22|
|3.3|Approval requirements .............................................................................................................. 22||
||3.3.1|Approval authority ......................................................................................................... 22|
||3.3.2|Minimum information to be provided ............................................................................ 23|
|3.4|Scenarios .................................................................................................................................. 23||
||3.4.1|Single lane closure ....................................................................................................... 23|
||3.4.2|Multi lane closure .......................................................................................................... 24|
||3.4.3|Mobile worksite ............................................................................................................. 24|
||3.4.4|Outer and inner lane closure ........................................................................................ 24|
||3.4.5|Works on ramps ........................................................................................................... 29|



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

3 

|**4**|**IMPLEMENTATION PHASE ............................................................................... 31**|
|---|---|
|4.1|Process overview ...................................................................................................................... 31|
|4.2|Communication protocols with the TOC ................................................................................... 31|
|**5**|**MAINTENANCE .................................................................................................. 33**|
|5.1|Compliance safety inspections ................................................................................................. 33|
|5.2|Changes required on-site ......................................................................................................... 33|
|5.3|Contingency protocols .............................................................................................................. 34|
|**6**|**DE-MOBILISATION ............................................................................................ 35**|
|6.1|Process overview ...................................................................................................................... 35|
|6.2|Communication protocols with TOC ......................................................................................... 35|
|**7**|**APPENDIX .......................................................................................................... 36**|
|**8**|**DOCUMENT INFORMATION.............................................................................. 46**|



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

4 

## **1 INTRODUCTION** 

## **1.1 Background and purpose** 

Traffic management activities for temporary roadworks in Victoria must comply with all applicable legislation and regulations. The primary source of relevant legislation and regulations applying to temporary traffic management is the _Road Management Act 2004 Code of Practice Worksite Safety – Traffic Management_ . 

Technical guidance for the planning, implementation and maintenance of traffic management activities for non-managed freeway-standard, arterial and local roads is well established. Other sources of technical guidance include: 

- Austroads Guide to Temporary Traffic Management (AGTTM) (2019); and 

- AS 1742.3:2019 Manual of uniform traffic control devices, Part 3: Traffic control for works on roads. 

While various technical documents like the AGTTM contain comprehensive guidance on temporary traffic management, the Department of Transport (DoT) and industry have identified that there is very limited guidance of worksite traffic management in a managed motorway environment. 

The purpose of this document is therefore to: 

- supplement the existing technical guidance specified in the AGTTM, by providing guidance and capturing learnings and good practice for managed motorways which can be very complex environments; and 

- produce an easy to locate and practical guidance on common situations encountered for worksite traffic management in managed motorway environments, including guidance on conducting such works on DoT managed roads. 

## **1.2 Application of this document** 

This document should be used for both planned and unplanned events on all DoT managed motorways. For unplanned events, the principles of this document apply to the setup and implementation of temporary traffic management within a managed motorway environment. Other sections of this document may not be applicable, however this will be dependent on the type of unplanned event that is being responded to. It should be noted that this document is not intended to be an incident response guideline. 

All terms listed within this document are as per the definitions within the AGTTM. 

## **1.2.1 Applicable road types** 

All DoT managed motorways are deemed to align with Austroads Category 3 roads. The Austroads road classification system is set out in Figure 2.1 of Part 8 of the AGTTM and is reproduced in Figure 1. 

Austroads Category 3 roads can be defined as: 

- high-volume motorways, or high volume/high-speed multi-lane motorways, with a divided carriageway; 

- any expressway and any associated on-ramps or off-ramps; 

- grade separated roads with speed limits greater than, or equal to 90 km/h; and 

- traffic volumes are generally greater than 20,000 vehicles per day (VPD) but can be lower. 

While some managed motorways within the Victorian road network have a posted speed limit of 80km/h, a Category 3 classification is considered appropriate due to the complex nature and high traffic volume of these motorways. This aligns with the note in Figure 1 which states ‘ _Category 3 applies only when the road is an expressway type road or is predominantly characterised by grade separated intersections_ .’ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

5 

**==> picture [398 x 223] intentionally omitted <==**

_**Figure 1 – Road categories for temporary traffic management applications**_ 

## **1.2.2 Applicability to mobile works** 

This document is intended to be applied to both mobile and non-mobile temporary works on managed motorways. For the purposes of this document, the definition of a mobile worksite is the same as that defined in Part 4 of the AGTTM: 

_Worksites which involve vehicles moving progressively along the roadway at speeds significantly lower than other traffic. All signs and devices are either vehicle mounted or moved along the roadway as works progress._ 

This definition is interpreted as referring to worksite vehicles operating at significantly lower speeds than the original posted speed limit. 

This document does not diminish the requirements for temporary traffic management identified within the AGTTM for both mobile and non-mobile worksites. It is intended to supplement the AGTTM by providing guidance on use of the freeway management system to support the requirements of the AGTTM. 

## **1.2.3 Applicability to long and short-term works** 

This document should be applied to both long term and short term works as defined by the AGTTM. The definition of short-term works is the same as that defined within Part 5 of the AGTTM: 

_Short term works comprise of the following activities:_ 

- _works that involve minimal plant, equipment and road workers_ 

- _works involving a frequently changing work area (e.g. grass cutting, shoulder grading, minor pavement maintenance and survey work)_ 

- _works that are of a short duration (less than a single shift but generally much shorter)_ 

- _works located sufficiently clear of traffic that only minimal warning is required to advise road users of the presence of workers._ 

All other works are considered long term works. 

## **1.3 Safe system approach** 

The Safe System approach is built on the premise that humans are likely to make mistakes and crashes will happen even with continued focus on prevention. With this in mind the Safe System philosophy is divided into five pillars: 

- Safer roads – consider how the road is designed, operated and maintained 

- Safer speeds – posted speed limits, level of compliance and physical constraints 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

6 

- Safer vehicles – improved technologies which contribute to crash avoidance 

- Safer road users – road user behaviour, levels of compliance and personal safety equipment 

- Post crash response – emergency and medical response 

For temporary traffic management, the Safe System pillars that must be considered in the development of the Traffic Management Plan (TMP) are safer roads, safer speeds and safer road users, to provide a safer environment for on-road workers and the vehicles that pass them. 

Managed motorway technology will assist with the Safe System approach, however the application of the temporary traffic management treatments identified in the AGTTM will be required to provide physical separation of worksites and motorists. Whilst Lane Use Management Signs (LUMS) and Variable Message Signs (VMS) are able to reduce vehicle speeds and direct lane usage, they have no ability to provide physical separation and protect workers for on-road sites. Therefore, LUMS and VMS must always be used when present to support physical infrastructure and traffic management on managed motorways. 

On Category 3 roads, the AGTTM guidelines require the use of a Truck Mounted Attenuator (TMA) which assists in protecting worksites. These are often struck by errant vehicles, with one typically struck every two months. Without these attenuators, it is likely that the errant vehicle would enter the worksite and endanger workers. This is why a combination of freeway management systems, on-road signage and physical delineation will be required for all temporary roadworks within a DoT managed motorway. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

7 

## **2 OVERVIEW OF MANAGED MOTORWAYS** 

## **2.1 Background** 

‘Managed motorways’ is the general term used to describe the broad suite of integrated tools, systems and devices that are used to manage traffic flow and respond to incidents and events across the motorway network in Victoria. Within the context of these guidelines, the LUMS is one of a number of control systems used to manage traffic and is the one of the primary tools available that can be used to assist the management of roadworks and planned events on motorways. 

The various systems and devices deployed across Victorian managed motorways can have multiple applications, depending on their context and the variable traffic and environmental conditions that may emerge. LUMS was originally developed as a control tool for managing unplanned incidents or events to ensure the safety of road users and incident responders, as well as providing traffic management on the approach to worksites. However, the system has evolved into one that can optimise traffic flow along the motorway network. 

The map contained in Figure 2 shows the location (and geographical extent) of the LUMS gantries on the Melbourne metropolitan motorway network. The map is to be considered indicative only, showing the locations of relevant traffic control devices on the network at the time of publication. As the network of available devices continues to in expand over time, additional sections of motorway will have managed motorway control tools that need to be incorporated into worksite traffic management plans. 

**==> picture [481 x 319] intentionally omitted <==**

_**Figure 2 – Location of LUMS and variable speed limits (VSL) across the Melbourne motorway network**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

8 

## **2.1.1 Elements of the Managed Motorway Toolkit** 

The aim of a managed motorway is to provide optimum traffic operations and travel times to facilitate safe, reliable and efficient journeys. Melbourne’s managed motorway network is world-leading and uses coordinated ramp metering signals as the primary control to manage motorway traffic flows. This is supplemented with: 

- ramp signals to regulate and space out vehicles entering the motorway - this improves merging and downstream motorway operation; 

- overhead integrated lane control and variable speed limit signs to control traffic flow, particularly in an incident; 

- on-road message signs displaying real time incident information, event and roadwork advice and travel times; and 

- CCTV cameras and vehicle sensors to manage traffic as well as monitor breakdowns and crashes. 

Table 1 provides a high-level overview of the key elements comprising Melbourne’s managed motorways. 

Further information can be found by referring to the following guidance documents published by DoT: 

- **Managed Freeways Handbook (Traffic Engineering Manual (TEM) Volume 3 Part 24)** which forms DoT’s primary reference for planning, designing and operating the State’s managed motorways. 

**==> picture [87 x 115] intentionally omitted <==**

- **Managed Motorway Design Guide** for more detailed information relating to the infrastructure, tools and systems comprising Victoria’s managed motorways. 

**==> picture [88 x 116] intentionally omitted <==**

- **Managed Motorway Framework** for the rationale and supporting evidence for active freeway management systems and overarching design principles. 

**==> picture [88 x 116] intentionally omitted <==**

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

9 

_**Table 1 – Key elements forming Melbourne’s managed motorway network**_ 

|Managed motorway element|Description|
|---|---|
|**Lane Use Management System (LUMS)**<br>Speed Limit<br>(40 - 100 km/h, increments of 10)<br>Lane Closed<br>Merge Left<br>Merge Right<br>Traffic in the lane to use the exit ramp<br>Down Arrow<br>(used in tunnel applications)|In conjunction with variable message signs (VMS) (see<br>below), LUMS are a key tool by which to manage<br>incidents and temporary roadworks on managed<br>motorways.<br>LUMS comprises of overhead lane control signs with<br>integrated VSL. LUMS allocates and manages lane use<br>across and along motorway carriageways. The<br>operation of lane use signs provides traffic management<br>to improve safety during abnormal operation, such as<br>an incident, high levels of congestion or roadworks.<br>LUMS is supported by mainline VMS during planned<br>and unplanned events.<br>At an individual location, LUMS are used to indicate the<br>status of lanes on the motorway being:<br>•<br>Speed Limit: lane is open (when speed limit value is<br>below prevailing, a portion of the red annulus<br>flashes);<br>•<br>Lane Closed: indicated by a red ‘X’ – it is illegal<br>under the Victorian road rules to continue in the<br>closed lane(s) beyond the first red ‘X’ encountered<br>until the lane is opened by appropriate symbols<br>downstream;<br>•<br>Merge: lane is closed downstream (generally at the<br>next active gantry), indicated by arrow diagonally<br>down to right or left; and<br>•<br>Exit: a diagonal arrow up to the left indicating users<br>that remain in the lane must exit (users may also<br>merge right if appropriate and follow the symbols<br>displayed over the adjacent lane.<br>Refer to Section 2.1 and 2.3 of “TEM Vol 3 Part 24<br>Managed Freeways Handbook” for further information.|
|**Variable Message Sign (VMS)**|In conjunction with LUMS, VMS are a key tool by which<br>to manage incidents and temporary roadworks on<br>managed motorways.<br>VMS can provide a range of information to motorists<br>including advice on emergencies, delays, detours, travel<br>times and traffic conditions. They can therefore provide<br>real-time advice to assist in the notification and<br>management of road incidents and roadworks by<br>providing context to drivers in relation to other control<br>displays, such as lane closures and reduced speed<br>limits.<br>During normal traffic operations, VMS boards can also<br>be used to inform drivers about expected travel times,<br>planned future works or other community safety<br>campaigns.|



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [10] 

## **Variable Speed Limit (VSL) sign (side mount)** 

**==> picture [208 x 116] intentionally omitted <==**

## **Variable Speed Limit (VSL) sign (overhead)** 

**==> picture [207 x 123] intentionally omitted <==**

## **Ramp Metering** 

**==> picture [207 x 135] intentionally omitted <==**

Side-mounted VSL signs are also used to display speed limits on entry ramps to managed motorways. 

The displayed speeds can be instantaneously changed by the Traffic Operations Centre (TOC) to reflect traffic incidents / roadworks on ramps, or to match reduced speeds on the mainline. 

VSL signs are therefore a key tool to manage incidents and temporary roadworks on managed motorways. 

In some locations on the managed motorway network overhead VSL signs are present that do not have integrated lane control symbols. Overhead VSL signs can be provided on: 

- entry ramps, before the merge with the mainline carriageway, in place of side mounted VSL signs. This may be due to limited space restricting the provision of side mounted signs and / or availability of suitable overhead structures; and 

   - short two-lane sections of carriageway that form either an extended ramp or collector distributor roadway. 

- 

Motorway ramp metering are traffic lights installed on an entry ramp to meter traffic into the motorway in a measured and regulated manner in order to manage the motorway traffic flow and prevent congestion and assist recovery from flow breakdown when it does occur. 

Metered entry ramps on motorway sections with LUMS also have VSLs to ensure that the speed of the entering traffic matches the speed of the mainline. 

When speeds are reduced on the mainline carriageway, for incident management or roadworks, the variable speed limit on an associated ramp also changes to match the mainline speed limit. 

Where roadworks are undertaken on an entry ramp, reduced speed limits on the ramp may prevent the ability for traffic to accelerate and merge at a similar speed to the mainline. Depending on the proximity of the work zone to the mainline merge, complementary speed limit reductions may be required on the mainline. 

Further detail for works on ramps is covered in Section 3.4.5. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [11] 

## **Vehicle Detection** 

**==> picture [203 x 120] intentionally omitted <==**

Regularly spaced Freeway Data Stations (vehicle detectors) provide vehicle volumes, speed and occupancy (proxy for density) on a lane-by-lane basis supplemented in some locations with vehicle classification/length data. 

Freeway Data Stations are installed on entry ramps and mainline carriageways for Coordinated Ramp Metering and other mainline monitoring and optimisation functions, and also on exit ramps to monitor and manage traffic queues. 

## **Closed Circuit Television (CCTV)** 

**==> picture [203 x 125] intentionally omitted <==**

Melbourne’s managed motorway network is equipped with a comprehensive CCTV system, providing the TOC with high visibility over both mainline and ramp metered entry ramp locations. 

This allows the TOC to monitor road incidents and other safety events, traffic flow conditions and the performance of ramp metering sites. 

## **2.1.2 Continued Expansion of LUMS Control across the Motorway Network** 

DoT policy in relation to managed motorways specifies that LUMS is generally required on all sections of motorways being built or significantly upgraded. Warrants and requirements are outlined in the Managed Motorway Design Guide (Vol 2 Part 1 Chapter 7). As a general rule, the warrants that trigger the requirements apply across the Greater Melbourne urban area. 

Current and future projects will continue to include the provision of LUMS where warranted and funding is available as part of corridor construction or upgrade projects. Integration of LUMS and associated managed motorway systems, devices and supporting infrastructure is currently included in long term planning and design for many future motorway projects and corridors across the greater Melbourne area. 

## **2.1.3 Traffic Operations Centre** 

LUMS and associated traffic management systems for responding to incidents and assisting roadworks on motorways are controlled by traffic operators in the TOC operated by DoT or similar management centres operated by private motorway operators. 

Operators in the DoT TOC undertake many tasks to ensure the safe and efficient movement of traffic across the whole DoT road network. The DoT TOC is responsible for overseeing operations on approximately 23,000km of road network, not just limited to motorways. A priority task for TOC operators is responding to unplanned incidents and events across the road network, such as crashes, breakdowns, onroad debris or inclement weather conditions. As LUMS control is centralised to the TOC to ensure consistent and rapid response to unplanned situation, the TOC is also tasked with implementing LUMS plans to assist roadworks on managed motorways. 

The capacity of the TOC staff and resources (with respect to the number of operators managing this system at any one time) is limited. Providing assistance to on-road works is an important aspect of the TOC activities, however during periods of high demand for real-time response management, there may be a need to prioritise various actions depending on the prevailing conditions across the road network. Due to the dynamic nature of traffic across the motorway network, the DoT TOC retains the authority to implement, cancel, modify or delay / postpone planned works in response to situations that can arise. 

The control system that manages LUMS and its associated devices is capable of deploying modified responses that can cater for overlapping events, although some situations may require significant 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [12] 

intervention that could impact the ability for work zones to either remain in their planned configuration or remain in place. In such circumstances, necessary changes to work zones or traffic management responses will be coordinated by the DoT TOC or the privately operated TOC for the section of the motorway network under consideration. 

There are areas of the managed motorway network that are subject to shared control between DoT and a privately operated TOC. Additional TMP approval requirements apply for these segments of motorway as outlined in Section 3.3. 

## _**2.2**_ **Functionality of STREAMS** 

The STREAMS system is currently the core system used by the DoT for controlling and monitoring the majority of the managed motorway devices across Victoria (other than traffic signals). In its current implementation, it is the primary application for monitoring the motorway network and undertaking managed motorways operations for traffic flow optimisation and incident response. 

## **2.2.1 Fundamental display rules** 

There are several fundamental rules that apply to displays on LUMS gantries on all DoT managed motorways as shown in Table 2. These rules cannot be overridden by TOC operators as they are mandatory to ensure safety and avoid driver confusion when managing unplanned incidents and events. 

In addition to the rules set out in Table 2, the following additional rules also apply and are applied automatically by the motorway control system: 

- when a speed limit is reduced (differs from the prevailing speed limit at the location), a portion of the annulus flashes to emphasise the reduction; and 

- if one or more panels on a LUMS gantry fails, the default operation for the DoT managed network is to blank all panels on the gantry, and the response that was to be displayed on the blanked gantry is propagated to the immediate upstream gantry. 

_**Table 2 – Fundamental rules that apply to displays at a LUMS gantry over a single carriageway**_ 

Rule Prevented Display No differential speed limit within one site Merge arrows cannot point towards each other within one site Lane merge signal cannot point towards a closed lane Lane merge signal cannot point towards a side barrier or an emergency stopping lane One blank sign requires the whole site to be blank ‘Exit Only’ signal must only be used on the furthest trafficable outside lane 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [13] 

## **2.2.2 Sequencing rules** 

In addition to the fundamental display rules that apply at a single gantry location, there are also a number of sequencing rules that apply along a LUMS controlled carriageway. It is important that personnel developing traffic management plans are aware of these rules to assist in planning and placement of primary work zone signage and understand the general principles that DoT TOC officers will consider when applying supporting LUMS responses. 

- A closed lane symbol must always be preceded by a merge arrow symbol in the corresponding lane as presented in Figure 3, unless it is an added lane on the motorway: 

**==> picture [476 x 220] intentionally omitted <==**

_**Figure 3 – Single lane closure**_ 

- Multiple lane closures must be propagated (cascaded) to ensure single lane merge movement per gantry as presented in Figure 4. 

**==> picture [476 x 220] intentionally omitted <==**

_**Figure 4 – Multiple lane closure**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [14] 

Appropriate treatment of “chicane” (transitioning closure from one side of the carriageway to the other) and desirable minimum of two unaffected gantries between worksites (irrespective of which side of the carriageway works may be in place) as presented in Figure 5. Two gantries are required between LUMS plans applied for separate road work events as shown in the lower image of Figure 5. 

**==> picture [476 x 275] intentionally omitted <==**

## _**Figure 5 – Example of dealing with chicanes through multiple work sites and desirable minimum gantry separation**_ 

Where the minimum two gantry separation cannot be achieved, speed smoothing may be implemented during roadworks with potential to conflict with static speed limit and may differ from the speed conditions that road workers expect. In the example presented in Figure 6, the speed limit would generally return to a higher (prevailing) limit for the section, however, due to the presence of a second downstream event, speed smoothing is applied to maintain a more consistent speed limit through the impacted sections. 

**==> picture [479 x 174] intentionally omitted <==**

_**Figure 6 – Speed smoothing**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [15] 

## **2.3 Limitations and restrictions** 

Whilst STREAMS and LUMS are highly reliable there are limitations that need to be considered when preparing a TMP for roadworks on managed motorways, which are described in the sections below. 

## **2.3.1 System faults / outages** 

Systems that are relied on for critical safety are given a Safety Integrity Level (SIL) rating to determine the risk factor of failure / outages. STREAMS and LUMS are not safety critical designed or SIL rated, and are therefore subject to outages (power failures, communication and device malfunctions). For this reason, LUMS cannot be used as a primary work site traffic safety control measure. 

Although rare, potential faults within the control system, individual devices or communications, or within STREAMS, can result in LUMS reverting to maximum allowed speed or blanking. This includes unplanned outages. 

## **2.3.2 Shoulders** 

Although TMPs often propose the use of shoulders as trafficable lanes during works, LUMS cannot be used to direct drivers to use shoulders due to a conflict with STREAMS’ fundamental rules (see Section 2.2.1). 

## **2.3.3 Separation of worksites** 

LUMS cannot be used to switch between left lane closure and right lane closure (chicaning) between adjacent worksites (or incidents) unless there is a separation of two or more gantries to ensure the appropriate merge symbols can be displayed, without conflicting with fundamental rules (see Section 2.2.1). 

## **2.3.4 Coordination of Multiple Work Zones or Incident Response** 

Challenges exist in relation to having multiple plans overlap and require merging or changes to responses for one or both sites while both are active. The general requirement is to provide a separation of at least two gantries between work zones to avoid potential overlaps, conflicts or problems during transitions. 

In the event that two work zones overlap, merging of TMPs is required which may be achievable in certain circumstances, but more complicated in others. When the plans are merged in STREAMS, the previous plan(s) are not stored as it is generally impractical to do so and therefore “un-merging” plans later is not possible (e.g. if one worksite finishes before the other). Reverting to a previous response requires a new plan to be generated which ensures that the latest traffic conditions are being addressed (i.e. due to the dynamic nature of traffic conditions and work site progress, it may be inappropriate to “return” to a prior plan). 

Depending on the complexity or the unique conditions that TOC operators may need to consider, custom modifications to responses (i.e. augmentations to system recommended plans) may be required. When merging of plans occurs, such customisations can be lost when reverting to a prior state which can result in less optimal responses deployed to the road. 

Response plans may also need to be modified to suit changing needs of some worksites. In a similar manner to the augmented responses discussed above, variations of responses can be lost or changed when merging with another work zone plan or when an incident response is deployed. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [16] 

## **3 PLANNING AND APPROVALS PHASE** 

## **3.1 Hierarchy of control** 

As a governing principle and in alignment with the VicRoads Chief Engineer’s Directive No. 2 (8 April 2019): 

- _Physical controls, such barriers, signs and TMA, must always be the_ _**primary** form of traffic control for roadworks on managed motorways. These protect workers by providing physical separation and barriers, which can prevent intrusion into the work zone._ 

- _LUMS, VSL signs and VMS must always be the_ _**secondary** form of traffic control as they cannot physically separate workers and vehicles., The objectives of LUMS, VLS signs and VMS are to:_ 

   - _support the primary physical controls by reinforcing reduced speeds and lane closures; and_ 

   - _provide advanced notification to drivers and preparing them for changed traffic conditions downstream._ 

As discussed in Section 2.1, LUMS, VSL signs and VMS controls are the key managed motorway devices with the capability to assist in the management of temporary roadworks. Each have dynamic capabilities to communicate changes in speed and lane utilisation and can be used effectively to support traffic management for temporary roadworks. 

However, in comparison to physical traffic management controls (e.g. temporary static signage, bollards, barriers and TMA), LUMS, VSL signs and VMS controls have three key weaknesses: 

- they do not offer any physical protection for on-site workers; 

- LUMS gantries are typically spaced at 500 metre intervals throughout the network, which may not align exactly with the worksite’s actual start and end location and may lead to lengthy speed reduction zones both before and after the worksite; and 

- compliance with LUMS / VSL signs is significantly lower in comparison to physical traffic management controls. 

It therefore follows that an appropriate application of LUMS, VSL signs and VMS in managing temporary roadworks is in supporting traditional physical traffic management controls, rather than as a direct substitute. 

## **3.2 Planning and design** 

The planning and design of TMPs must comply with all applicable legislation and regulation, and must be undertaken in accordance with the technical guidance set out in the AGTTM. 

The following sections set out additional technical requirements for TMPs on managed motorways, which in comparison to non-managed motorways: 

- may involve the use of LUMS, VSL signs and fixed VMS; and 

- tend to be subject to more space constraints (e.g. narrow shoulders). 

## **3.2.1 Site investigation** 

A site investigation must be conducted during the preparation of any TMP on a managed motorway. The site investigation must, in addition to the requirements of the AGTTM, include: 

- identification of all LUMS, VSL signs and VMS devices within the vicinity of the works, including: 

   - all devices that fall inside the worksite boundary; 

   - all nearby devices that will be used as part of traffic management for the works; and 

   - in addition to the devices above, one additional LUMS gantry both upstream and downstream; 

- identification of all LUMS, VSL, VMS and gantry reference numbers; 

- identification of any overhead VSL signs within the works area and noting that they cannot be used to close lanes; 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [17] 

- identification of any LUMS, VSL signs and VMS devices that are inactive/defective within the vicinity of the works; 

- identification of any sight distance or general visibility constraints associated with LUMS, VSL signs and VMS throughout and near the worksite, including: 

   - the visibility of the nearest downstream LUMS gantry from the end of the worksite; and 

   - the visibility of the start of the worksite from the nearest upstream LUMS gantry; 

- the approximate distances between successive LUMS gantries within the vicinity of the works; 

- the location of entry and exit ramps in relation to the worksite; 

- understanding of shoulder widths where advance warning signs are proposed to be placed; 

- identification of nearby or adjacent works, including any nearby usage of LUMS, VSL signs and VMS to manage other roadworks; 

- identification of any road safety cameras within or adjacent to the works area; and 

- any other risk factors which may affect the implementation or effectiveness of LUMS, VSL signs and VMS controls for the temporary roadworks. 

A checklist for the site investigation is provided in the Appendix. 

## **3.2.2 Planning stage risk assessment** 

For any TMP prepared for a managed motorway, a risk assessment must be performed during the planning stage which considers the findings from the site investigation conducted under Section 3.2.1. Note that an additional risk assessment is also required at the implementation stage in accordance with Section 4.1. 

Planning stage risk assessments must, in addition to the requirements of the AGTTM: 

- where multiple worksites are proposed, be conducted individually for each worksite; 

- consider the need for extending (upstream, downstream or both) use of LUMS, VSL signs and VMS to address on-site constraints, such as visibility and sight distance. This would also need to take into account the visibility between the worksite and nearest upstream / downstream LUMS gantries as identified in the site investigation; 

- based on the findings of the site investigation, determine whether the frequency of compliance safety inspections should be increased over and above AGTTM requirements. Changes to the frequency of compliance safety inspections can be due to, but are not limited to, issues such as sight distance, ramp configuration and the complexity of the site; 

- where works are proposed to be conducted on entry ramps, confirm whether sufficient distance is available to drivers to safely merge with the mainline at the sign-posted speed; 

- in the case of mobile works of a short duration (refer Section 3.2.3), determine whether a generic TMP is suitable and provide justification and evidence to support this determination; 

- identify the risk of communication errors between contractors and the TOC officers which may result in unintended changes in sign displays exposing road workers to risk; 

- identify the risk of power failures which could occur at any time and result in blank signs or a change to a display other than intended; and 

- note the risk of system faults which could occur at any time and result in blank signs or a change to display other than intended. 

A checklist for the planning stage risk assessment is provided in Appendix A. 

## **3.2.3 Site-specific TMP requirements** 

Site-specific TMPs must be prepared in accordance with the requirements of the AGTTM. Additional requirements for works on managed motorways are presented in Table 3. 

Generic TMPs are only permitted in the case of short-term mobile works where a risk assessment has explicitly deemed that a site-specific TMP is impractical due to the nature of those works. This is because mobile works can often be of a short duration, or may cover a long distance throughout the works making it impractical to capture in a single site-specific plan. While a generic TMP is suitable for some works, it will 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [18] 

still require site specific information such as location, LUMS reference, VMS reference and road safety camera information as applicable. 

However, for all other instances (i.e. non-mobile works), site-specific TMPs are required due to the generally higher complexity and safety hazards encountered for these worksites on managed motorways. 

_**Table 3 – Site-specific and generic TMP requirements**_ 

|Works type|TMP requirement|
|---|---|
|Mobile works|Generic TMPs may be prepared if the risk assessment deems that site-<br>specific TMPs are not practical / suitable (e.g. duration less than 30<br>minutes at a given site).|
|Non-mobile works|Site-specific TMPs required for all non-mobile works on managed<br>motorways.|



## **3.2.4 Design requirements – on-road signage** 

Physical traffic management should be limited around the required work area only, in accordance with the AGTTM. It is not required to extend the physical traffic management to align with the LUMS, however consideration could be given to extending the signage for longer term works. 

The following design requirements should be considered for use of on-road signage on managed motorways (the requirements of the AGTTM should always be followed, with these requirements considered supplementary to the AGTTM): 

- the placement of on-road signs should not create an additional hazard. Managed motorways often have space constraints such as limited shoulders and in these locations, on-road signage can become a hazard if located too close to, or within, the traffic lane. Where space constraints exist: 

   - on-road signage must not be attached to concrete median barriers if it effects the integrity of the barrier or is likely to become a hazard (e.g is close to or protrudes into traffic lanes); 

   - on-road signage may be attached to adjacent poles, as long as the signage does not overhang adjacent lanes or create a safety hazard; 

   - it is acceptable to provide on-road signage on only one side of the carriageway. However, consideration should be given to the use of VMS to provide advanced notice of the works and speed reductions; and 

   - signage can be placed on the road once a traffic lane has been closed, using bollards or TMAs, in accordance with the AGTTM; 

- roadworks ahead signage must be used in accordance with the requirements of the AGTTM, and: 

   - signs should not be placed too far in advance of the actual work site. Placing signage too far in advance reduces the levels of compliance and reduces safety at the work site; and 

   - signs should be placed on both sides of the carriageway unless space constraints prevent this from occurring; 

- repeater speed limit signs must be used in accordance with the requirements of the AGTTM, and: 

   - repeater signs may be static signs placed within closed traffic lanes or on VMS boards which may be mounted on TMAs; and 

   - repeater signs should not be placed on-road in locations where there are space constraints such as narrow shoulders; 

- with respect to end roadworks signs: 

   - they are to be placed in accordance with the requirements of the AGTTM and should include signage indicating the return to posted speed limits. This is to minimise the speed differential between vehicles, with some accelerating once they have passed the worksite, while others waiting to accelerate until they have passed the next LUMS gantry, However end of roadworks and the return to the posted speed limits can be separate if installed in accordance with the AGTTM; 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [19] 

- the use of an ‘END’ speed limit sign is not preferred due to the different speed limits on managed motorways and the confusion this can create for motorists; 

- as per the AGTTM, end of temporary speed zone signs should be placed on both sides of the carriageway, except if there are space constraints such as limited shoulders, where only a single sign is acceptable; and 

- for clarity, end of roadworks signs (including return to prevailing speed sign if greater than 100 m from the approach to the LUMS) should be placed even if LUMS are visible from that location. 

A checklist for the on-road signage design requirements is provided in the Appendix. 

## **3.2.5 Design requirements – LUMS and VMS** 

The following requirements should be considered during the design of temporary traffic management within a managed motorway environment that will utilise LUMS, VSL signs and / or VMS (the requirements of the AGTTM should always be followed, with these requirements considered supplementary to the AGTTM): 

- all TMPs prepared for managed motorways must consider the usage of LUMS, VSL signs and VMS (as appropriate) to assist in the management of roadworks: 

   - LUMS, VSL signs and VMS must be used to support physical on-road treatments identified within the AGTTM and cannot solely be used to manage roadworks on managed motorways; 

   - a LUMS and VMS implementation plan must always be included within any TMP that proposes to utilise LUMS, VSL signs or VMS for the management of temporary roadworks on managed motorways; 

   - the TMP for the worksite must identify any adjacent worksites both up and downstream of the site. Those responsible for preparing the TMP are required to inform themselves of other works near the site; 

   - a minimum separation of two LUMS gantries is required between adjacent worksites. If this is not possible, a single LUMS and VMS implementation plan must be prepared which addresses the use of LUMS across both worksites. Separate TMPs are to be generated for each worksite, and must be resubmitted following ‘de-merging’ of worksites (i.e. after one worksite finishes, to reflect the response for the remaining active site); 

   - risk of a LUMS outage or power failure must be considered in the development of TMPs, and as well as the potential need for on-road signage in the event of an outage; 

   - only one new red ‘X’ indicating a lane closure may be introduced per LUMS gantry; and 

   - `o` where mobile works are proposed, a mobile works response plan must be developed and identify which LUMS are required to be changed as the works proceed and the communication protocols with TOC to request and implement changes to the LUMS. 

- the overall length of the treatment should be minimised, acknowledging the limitation to site length such as the spacing of the LUMS (refer Section 3.4 for worked examples): 

   - the length of a LUMS managed section could be extended due to the following reasons: 

      - prevailing speed limit of the motorway; 

      - poor sight distance to the worksite; 

      - poor sight distance to on-road treatments such as bollards or TMAs; 

      - entry and exit ramp configurations and locations; 

      - length of the actual worksite; 

      - grade of the road; 

      - vehicle mix on the road adjacent to the worksite; and 

      - any other risk factors identified during the site investigation / risk assessment. 

   - the length of a LUMS managed section must be extended if a road safety camera is located adjacent (within one LUMS gantry section) to the worksite. Camera locations are available at camerassavelives.vic.gov.au; and 

   - speed reductions and lane closures implemented using LUMS or VSL signs should be implemented as close as possible to physical on-road traffic management infrastructure. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [20] 

Having visible on-road infrastructure (e.g. bollards and static signage) improves driver compliance with LUMS and VSL sign directions; 

- lane closures should be logical, with stepped implementation of changes to the displays on the LUMS. The general approach for closing a single lane will be as follows, noting that it will need to be adjusted to meet site-specific requirements: 

   1. advanced notification of the works using a VMS located upstream, which can be an existing permanent or temporary VMS; 

   2. an initial speed reduction (for example 80km/h to 60km/h) administered no closer than two LUMS gantries to the start of the worksite and which can be combined with an arrow indicating a need to merge into the adjacent lane due to lane closure ahead; 

   3. a further speed reduction (for example 60km/h to 40km/h) at the last LUMS gantry prior to the start of the worksite combined with a red ‘X’ indicating a lane closure just prior to the worksite; 

   4. LUMS gantries that are located within the worksite are to repeat the directions in Point 3 above; and 

   5. once past the worksite, all lanes open and speeds revert back to their prevailing setting; 

- 

   - VMS should be used to inform motorists of the works ahead: 

      - where possible, existing VMS must be used for the advanced notification of downstream works and to justify the need to merge / reduce speed. However, it is acknowledged that the road network under the control of DoT has limited permanent VMS locations. In these circumstances, temporary VMS should be considered; 

      - where existing VMS is utilised for advanced notification, a distance to the worksite should be included in the VMS messaging; and 

      - any temporary VMS will need to be located safely and not create a traffic hazard. The location for any temporary VMS must be identified within the TMP. If this is a long distance from the worksite, appropriate wording such as ‘1km ahead’ must be included within the VMS display (the temporary VMS should not be placed more than 5km ahead of the worksite); 

- works on motorway entry or exit ramps may require changes to speed limits on the motorway mainline to allow for slow moving vehicles entering or exiting the motorway. This should be based on a risk assessment and consider: 

      - for entry ramps: 

         - Two reference speeds are important for the risk assessment: 

            - Speed at the start of the acceleration length beyond the work zone (Vs) - The reasonable speed of vehicles at the end of the work zone (end road works sign) also taking into account any other restrictive work zone activities that may restrict vehicle speeds (e.g. manual stop-go control within the work zone) 

            - Free-Flow Speed on the mainline with which entering traffic would need to merge (Vff) – Mainline speed accounting for non-congested operations and the highest prevailing speed limit applicable to the mainline during the entire works period (i.e. mainline speed limit). 

         - Where the speed of an entering vehicle from the ramp can reasonably accelerate to within 20km/h of the Vff, a mainline speed reduction may not be required. If the speed difference between an entering vehicle and the Vff > 20km/h, a mainline speed reduction needs to be considered. 

            - Where a speed reduction is required, the mainline speed need only be reduced to ensure the difference between mainline speed and reasonable entering speed is less than 20km/h (i.e. For a mainline with a 100km/h default speed limit displayed, if the reasonable entering speed that can be achieved within the available acceleration length is 70km/h, a mainline speed limit reduction to 80km/h should be provided at the merge location). 

         - The start of the final merge taper for entering traffic shall be used as the reference location for the end of the available acceleration length of entering vehicles. 

         - Comfortable acceleration distances should be based on Tables 5.5 and 5.6 of the Austroads Guide to Road Design, Part 4A, using Ve as the design speed of entering traffic and Vff as the design speed of the road being entered. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [21] 

         - Assessment of the reasonable acceleration lengths and implications for mainline speed limits reduction need to be provided as part of a TMP submission for review by DoT; and 

      - if a speed reduction is applied on the motorway mainline due to works conducted on an entry ramp, advanced VMS should be utilised to inform motorists of the reason for the speed reduction; 

   - for exit ramps: 

      - an assessment should be performed to determine the deceleration length required between the posted speed limit on the motorway and the location of the worksite on the exit ramp; 

      - if there is insufficient distance between the start of the exit taper for the exit ramp and the worksite for a vehicle to decelerate to the worksite speed limit, a speed reduction must be applied on the motorway mainline; and 

      - if a speed reduction is applied on the motorway mainline due to works conducted on an exit ramp, advanced VMS should be utilised to inform motorists of the reason for the speed reduction; 

   - if an entry ramp merges with the mainline within the worksite, the speed limit on the ramp must be reduced to align with the worksite speed limit on the motorway mainline; 

- contingency protocols should be developed for managing any incidents in or near the worksite. These protocols will cover the potential need to adjust or include additional LUMS to respond to an incident and further guidance can be found in Section 5.3 of this document. 

A checklist for the LUMS and VMS design requirements is provided in the Appendix. 

## **3.2.6 Design requirements – Works near Road Safety Cameras** 

The following design requirements must be considered when planning works in the vicinity of road safety cameras: 

- road safety cameras must be identified in the vicinity of the proposed works: 

   - the contractor must identify within its TMP the location of any road safety cameras within or adjacent to its worksite; 

- if the road safety camera is located within one LUMS gantry section of the works, any changes to the LUMS must be extended to include this road safety camera; 

- in designing TMPs in the vicinity of road safety cameras, is of critical importance that compliance with standards is achieved. This includes compliance with positioning of Roadwork Ahead signs, speed reduction signs, repeaters signs, End Roadwork signs and speed signs reinstating the speed limit; 

- the contractor must provide notification to the Department of Justice and Community Safety Victoria (DJCS) during the approvals phase of the proposed works and the proposed speed limit adjustments. Any non-compliant or non-standard arrangements shall be disclosed to DJCS. 

A checklist for the works near road safety camera design requirements is provided in Appendix E. Locations of camera sites can be found at camerassavelives.vic.gov.au. 

## **3.3 Approval requirements** 

This section sets out additional approval and submission requirements for traffic management activities on managed motorways. These requirements are in addition to those specified in the AGTTM guidance and in any applicable legislation and regulation. 

## **3.3.1 Approval authority** 

Applications to conduct traffic management activities for roadworks (referred to in this document as Memorandum of Authorisation or ‘MOA’) on managed motorways must be submitted to the relevant approval authority depending on the location of the works, as outlined in Table 4. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [22] 

_**Table 4 – Relevant approval authority**_ 

|Worksite location|Approval authority|
|---|---|
|State managed motorways|DoT Permits / Events|
|Interface area between State<br>managed motorways and<br>CityLink|DoT Permits / Events and Transurban|
|Interface area between State<br>managed motorways and<br>EastLink|DoT Permits / Events and ConnectEast|



## **3.3.2 Minimum information to be provided** 

In addition to the requirements set out in the AGTTM and any other applicable legislation, the following information must be submitted to the relevant approval authority as part of an MOA application: 

- all LUMS gantries, VSL signs, VMS boards and where relevant the road safety camera asset numbers that are referred to in the TMPs must provide asset numbers; 

- the duration of works and the timing of all speed changes on LUMS must be clearly articulated, and for long-term works must set out long-term changes to speeds or lane utilisation. The classification of longterm works is the same as the AGTTM, which is any traffic guidance scheme that is required to operate both day and night and may be left unattended; 

- identification of nearby or adjacent works, including any potential conflicts or overlapping requirements in the usage of LUMS, VSL signs and VMS; and 

- a nominated single point of contact for communication purposes with the TOC throughout the duration of the works. Where this is not feasible due to the size or the duration of the works then multiple contacts may be nominated, but must be minimised in order to streamline communications. 

A checklist for the for the minimum information to be provided for approvals is provided in the Appendix. 

## **3.4 Scenarios** 

The following scenarios are provided as example LUMS and VMS setups and are to be used as a guide only. These scenarios have been generated assuming that the prevailing posted speed limit is 80km/h. In 100km/h situations, the LUMS must be extended by one further gantry, dropping the speed limit from 100km/h to 80km/h without any lane allocation signs or closures. 

A site specific LUMS and VMS implementation plan is required to be developed for all TMPs on managed motorways which takes into consideration any on-road hazards or constraints. This implementation plan must be prepared in accordance with Section 3.3.2 of this document. 

Note that these scenarios do not show all on-road signage, and are not to scale. On-road signage should be installed in accordance with the requirements of the AGTTM. The worked examples are presented in the following pages. 

## **3.4.1 Single lane closure** 

A single lane closure scenario is presented in Figure 7. The steps for implementing this treatment are: 

- advanced VMS advising of the worksite ahead and the need to change lanes; 

- 20km/h reduction in speed limit plus a lane allocation arrow directing traffic to exit the lane to be closed; 

- a further 20km/h reduction in speed plus a red ‘X’ indicating that the lane is closed to traffic; and 

- at least 50m past the worksite (as per the requirements of AGTTM), end of roadworks signage must be placed which includes return to prevailing speed signs (even if LUMS are visible from that location). 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [23] 

## **3.4.2 Multi lane closure** 

A multi lane closure scenario is presented in Figure 8. The steps for implementing this treatment are as follows: 

- advanced VMS advising of the worksite ahead and the need to change lanes; 

- 20km/h reduction in speed limit plus a lane allocation arrow directing traffic to exit the lane; 

- a further 20km/h reduction in speed, a red ‘X’ indicating that the lane is closed to traffic plus an additional lane allocation arrow directing traffic to exit the lane to be closed; 

- maintaining the 40km/h speed zone, plus two red ‘X’s closing both lanes; and 

- at least 50m past the worksite (as per the requirements of AGTTM), end of roadworks signage must be placed which includes return to prevailing speed signs (even if LUMS are visible from that location). 

## **3.4.3 Mobile worksite** 

Mobile works within the managed motorway environment will be planned on the assumption that they are conducted on a Category 3 road due to their high-volume nature, which prohibits on-foot activities. All temporary traffic management for mobile works must meet the requirements presented in Part 4 of the AGTTM. 

An example of the LUMS and VMS setup for mobile works is presented in Figure 9. A single lane is closed as per the single lane closure example, however the speed reduction and lane closure are continued for a single LUMS gantry beyond the worksite. This is to enable the works to continue into the next section of LUMS controlled motorway and reduce the number of times that adjustments need to be requested and made. This treatment must move with the mobile works such that one LUMS gantry before and after the worksite continues to implement the lane closure at all times. 

## **3.4.4 Outer and inner lane closure** 

An outer and inner lane closure scenario is presented in Figure 10. The steps for implementing this treatment are as follows: 

- advanced VMS advising of the worksite ahead and the need to change lanes; 

- 20km/h reduction in speed limit plus a lane allocation arrow directing traffic to exit the lane; 

- a further 20km/h reduction in speed, a red ‘X’ indicating that the lane is closed to traffic and an additional lane allocation sign indicating that the slow lane is to be closed; 

- maintaining the 40km/h speed zone with red ‘X’ closing the worksite lane, plus a red ‘X’ closing the slow lane; 

- maintaining the 40km/h speed zone through the worksites including red ‘X’ where required; 

- at least 50m past the worksite (as per the requirements of AGTTM), end of roadworks signage must be placed which includes return to prevailing speed signs (even if LUMS are visible from that location). 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [24] 

**==> picture [708 x 409] intentionally omitted <==**

_**Figure 7 – Single lane closure example**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

25 

**==> picture [688 x 410] intentionally omitted <==**

_**Figure 8 – Multi lane closure example**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

26 

**==> picture [688 x 424] intentionally omitted <==**

_**Figure 9 – Mobile worksite example**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

27 

**==> picture [736 x 409] intentionally omitted <==**

_**Figure 10 – Outer and inner lane worksite example**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

28 

## **3.4.5 Works on ramps** 

As discussed in Section 3.2.4, speed reductions may be required on the motorway mainline depending on the location of the worksite on the entry or exit ramp. 

Figure 11 shows the assessment that should be performed for vehicle speeds on an entry ramp to determine if a speed reduction is required on the freeway mainline. This is based on the amount of space available for a vehicle to accelerate from the end of the work zone to approach to speed on the freeway mainline. 

If the speed difference between an entering vehicle (Ve) and the speed on the freeway mainline (Vff) is greater than 20km/h, a mainline speed reduction needs to be considered. 

**==> picture [448 x 187] intentionally omitted <==**

## _**Figure 11 – Entry ramp work zones**_ 

Figure 12 provides an indication of the checks and analysis that need to be performed to determine if a speed reduction is required on the motorway mainline for works conducted on an exit ramp. 

Sufficient distance is required between the motorway mainline and the start of the temporary traffic management to allow a vehicle to decelerate from the posted speed limit (i.e. 80km/h or 100km/h) without the need to decelerate on the mainline itself. 

If a vehicle is required to decelerate on the mainline to meet the temporary worksite speed limit, a speed reduction on the mainline will be required. This treatment is to avoid speed differentials on the motorway mainline which can create a traffic hazard. Vehicles should not be decelerating on the mainline to exit the motorway. 

**==> picture [448 x 165] intentionally omitted <==**

_**Figure 12 – Exit ramp work zone**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [29] 

A mainline speed reduction for works conducted on an entry ramp is presented in Figure 13. The steps for implementing this treatment are as follows: 

- advanced VMS advising of the worksite ahead and that works are on the entry ramp; 

- 20km/h reduction in speed limit; 

- a further 20km/h reduction at the next LUMS gantry, prior to the entry ramp; and 

- past the entry ramp, end of roadworks signage must be placed which includes return to prevailing speed signs (even if LUMS are visible from that location). 

**==> picture [378 x 214] intentionally omitted <==**

_**Figure 13 – Entry ramp LUMS configuration**_ 

A mainline speed reduction for works conducted on an exit ramp is presented in Figure 14. The steps for implementing this treatment are as follows: 

- advanced VMS advising of the worksite ahead and that works are on the exit ramp; 

- 20km/h reduction in speed limit; 

- a further 20km/h reduction at the next LUMS gantry, prior to the exit ramp; and 

- past the exit ramp, end of roadworks signage must be placed which includes return to prevailing speed signs. 

**==> picture [394 x 206] intentionally omitted <==**

_**Figure 14 – Exit ramp LUMS configuration**_ 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [30] 

## **4 IMPLEMENTATION PHASE** 

The implementation phase is the initial setup of the temporary traffic management, which includes both the freeway management system (LUMS, VSL signs and VMS) and on-road signage which can include TMAs. 

The requirements for implementation generally align with those presented in the AGTTM, however this section sets out additional requirements and processes to be applied for managed motorways. 

A checklist for the implementation phase is provided in the Appendix. 

## **4.1 Process overview** 

Prior to any works commencing within the road reserve, the following must be performed: 

- an on-road risk assessment is required to identify any hazards or issues that might not have been identified during the planning phase risk assessment and must include a review of the LUMS and VMS to identify any that may be defective. This risk assessment must identify changes required to the TMP to address any on-site hazards that were not addressed or identified by the planning stage risk assessment, and the contractor must have this information ready to discuss with the TOC when contact is made; 

- two separate phone calls must be made to the TOC to implement changes to the LUMS and VMS. The procedure for these phone calls is provided in Section 4.2; 

- a drive-through inspection of the site must be performed to verify successful execution of the LUMS and VMS implementation plan prior to works commencing; and 

- the following principles must be followed regarding the installing of on-road signage: 

   - no equipment is permitted to be moved on-road prior to the drive-through inspection and confirmation that the LUMS have been successfully adjusted as required. 

   - the installation of equipment must commence on-road within 10 minutes of the drive-through inspection being performed. This will assist in maintaining compliance with the LUMS as drivers will be able to see the reason for any reduction in speed limit; and 

   - inspection records are required to log when the LUMS / VMS were altered and when the drivethrough inspection was performed. This should also log any irregularities / errors / defects identified with the LUMS / VMS and all requests to the TOC to rectify issues identified during the drive-through inspection. It is recommended that video evidence of the drive-through inspection is kept however this is not a mandatory requirement. 

## **4.2 Communication protocols with the TOC** 

The on-site contractor is required to call the TOC to initiate the LUMS and VMS implementation plan in alignment with its approved TMP. This section will set out communication protocols that the contractor must follow when contacting the TOC to initiate its LUMS and VMS plan, including a checklist of information required to be provided to the TOC. 

The DoT TOC can be contacted on **13 11 70** . 

The TOC is to be contacted prior to the installation of any on-road equipment. 

Preferably calls to the TOC are to be made by the single point of contact for the duration of the works as nominated in the MOA application. Where this is not feasible due to the size or the duration of the works then the call to the TOC must be made by one of the multiple contacts nominated in the MOA application. 

In locations where works are being performed in interface areas between two road operators, a call must be made to both corresponding TOCs. 

For each stage of the LUMS / VMS implementation plan, a call to the TOC must be made when the contractor wishes to initiate that stage of the plan. 

The contractor must have the following information at hand when calling the TOC to implement LUMS and VMS plans, in order to reduce the time required to confirm the changes and to assist in accurately implementing the TMP: 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [31] 

- project reference number. This reference could be the MOA, LOC and IMP number or the RWE reference; 

- approved TMP reference; 

- site location including road being worked on and direction; 

- extent of worksite; 

- on-site contact details, preferably a single point of contact for the site; 

- identification of any other works within the area; 

- TMP details including number of lanes to be closed, and what speed changes are required from the default system; 

- any changes to the approved TMP based on the on-site risk assessment; 

- list of LUMS to be altered, including the gantry ID number for each; 

- list of VMS to be altered, including asset numbers, and the proposed text to be displayed; and 

- • Where applicable, road safety camera asset numbers. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [32] 

## **5 MAINTENANCE** 

Maintenance of traffic management for temporary roadworks including safety inspections and road safety audits, must be conducted in accordance with AGTTM guidance and any applicable legislation and regulations. This section sets out additional requirements for traffic management for temporary roadworks on managed motorways. 

## **5.1 Compliance safety inspections** 

The scope and frequency of compliance safety inspections must meet the requirements of AGTTM. Additional requirements (over and above AGTTM) apply for traffic management activities on managed motorways. These requirements have been set out in Table 5. 

_**Table 5 – Compliance safety inspection requirements**_ 

|Applicable<br>works|When compliance safety inspections<br>are required|Scope of inspection|
|---|---|---|
|Managed<br>motorways|In accordance with AGTTM:<br>•<br>At the start of works<br>•<br>At each major change to the TMP<br>e.g. staged works<br>•<br>During day and night operation<br>•<br>When unexpected significant<br>disruptions occur to traffic<br>•<br>At the request of site safety or WHS<br>representative<br>All of the above, plus:<br>•<br>After each change in LUMS, VSL<br>signs and VMS is confirmed to be<br>implemented by the TOC|In accordance with AGTTM:<br>•<br>Safety of workers, road users and the<br>public at work site<br>•<br>Signs, road marking, temporary safety<br>barriers, lighting and facilities for<br>pedestrians and cyclists are implemented<br>as per the TGS.<br>•<br>Traffic compliance with the implemented<br>traffic management plan<br>•<br>Access to abutting properties<br>•<br>Effect of the works on surrounding land<br>use<br>•<br>Differences in weather conditions<br>•<br>Traffic flow and road congestion to<br>determine how the traffic is flowing<br>All of the above, plus:<br>•<br>LUMS, VSL signs and VMS have been<br>implemented according to the TMP prior to<br>set-up<br>•<br>Consistency between LUMS, VSL signs<br>and VMS and static signage wherever a<br>change in LUMS, VSL signs and VMS has<br>been implemented by the TOC<br>•<br>Any other elements identified in the risk<br>assessment|



## **5.2 Changes required on-site** 

Where changes to traffic management are required after implementation, the communication protocols will apply as per the implementation phase (Section 4.2) where a ‘two phone call’ request process to the TOC is required along with a checklist of information to be at hand. 

Following implementation of the requested changes by the TOC, a drive-through inspection of the site must be performed to verify successful execution of the LUMS and VMS implementation plan prior to works commencing, in accordance with the inspection requirements set out in Section 4.1. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [33] 

## **5.3 Contingency protocols** 

In the event of faults on LUMS, VSL signs or VMS devices the following contingency protocols must be adhered to by on-site workers: 

- the nominated contact must call the TOC immediately to inform them of any faults including incorrect speeds / lane indicators or blank displays; 

- if road safety cameras are within the approved TMP, the TOC will contact DJCS; 

- TMAs must be maintained on-site to protect workers at all times, with one TMA per occupied lane; 

- if LUMS, VSL signs or VMS are not operational or have blank displays, the following steps must be implemented as soon as practicable: 

   - if workers are exposed to traffic due to a failure of the LUMS, VSL or VMS, they must immediately leave the site until the following steps have been implemented: 

      - reinforce lane closures and speed reductions by using additional static signage; 

      - depending on the length of the site, review the provision of repeater signs and provide additional signage if required to meet the requirements of AGTTM. Repeater signs are to be set up on both sides of the road where speeds are 60km/h or lower if there is sufficient space; and 

      - VMS messages should be reinstated using TMA VMS boards; 

- if LUMS / VSL signs can only display speeds and not lane utilisation: 

   - lane closure signage to be reviewed and additional lane closure signage provided where required (i.e. lane allocation signs, chevrons etc); 

   - repeater signs are to be set up on both sides of the road where speeds are 60km/h or lower; and 

   - VMS messages should be reinstated using TMA VMS boards; 

- if LUMS / VSL signs are displaying incorrect speeds: 

   - if displayed speeds have reverted to prevailing or are otherwise displaying speeds that are higher than those on the TMP, all works must be stopped while the TOC is contacted to rectify signs; or 

   - if displayed speeds are lower than those shown on the TMP the works may continue but the TOC must be contacted to rectify; 

- if VMS signs are displaying incorrect message: 

   - works can continue however a review of the advanced static signage is required to confirm that it meets the requirements of AGTTM. If not, additional signage is required to be installed to meet AGTTM advanced notification requirements; and 

   - advise the TOC that the VMS messaging is incorrect and request rectification. 

- for every fault that occurs, a report must be submitted to the TOC prior to the end of the relevant shift which provides the following details: 

   - identification of the affected LUMS gantries / VSL signs / VMS boards, including location description and ID number; 

   - time of the incident; 

   - cause of the fault (if known); and 

   - a description of the steps undertaken during that shift to make the site safe in response to the fault. 

A checklist for the contingency protocols is provided in the Appendix. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [34] 

## **6 DE-MOBILISATION** 

## **6.1 Process overview** 

In addition to the requirements of AGTTM, the following process must be followed when de-mobilising traffic management on a managed motorway: 

1. All physical infrastructure including static signage, bollards and TMAs are to be removed. 

2. A call must be made to the TOC when the contractor is ready to revert LUMS / VMS to default signage (see Section 6.2 for further details). 

3. The TOC will perform a final check to confirm reversion of LUMS and VMS. 

## **6.2 Communication protocols with TOC** 

Communication protocols with the TOC during de-mobilisation mirror those for the implementation phase, as set out in Section 4.2. The same TOC must be contacted as per the implementation phase. 

For each stage of the de-mobilisation of LUMS / VMS, a call to the TOC must be made when the contractor wishes to request the reversion of LUMS / VMS to default operation. 

The contractor must have the following information at hand when calling the TOC to de-mobilise LUMS and VMS: 

- project reference number; 

- approved TMP reference; 

- site location including road being worked on and direction; 

- extent of worksite; 

- on-site contact details, preferably a single point of contact for the site; 

- identification of any other works within the area; 

- any changes to the approved TMP based on the on-site risk assessment; 

- list of LUMS to be reverted, including the gantry ID number for each; and 

- list of VMS to be reverted, including asset numbers, and the proposed text to be displayed. 

A checklist for de-mobilisation is provided in the Appendix. 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [35] 

## **7 APPENDIX** 

Checklists for each phase can be found in this Appendix. These checklists are provided for general assistance and should not be considered mandatory in the development of traffic management plans. 

Checklists for the following are provided: 

- Appendix A Pre-works site investigation 

- Appendix B Risk assessment 

- Appendix C On-road signage 

- Appendix D LUMS and VMS 

- Appendix E Works near road safety cameras 

- Appendix F Approvals phase – minimum information to be provided 

- Appendix G Implementation phase 

- Appendix H Contingency protocols 

- Appendix I De-mobilisation 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [36] 

## **Appendix A** 

**Pre-works Site Investigation Checklist for Temporary Traffic Management on Managed Motorways** 

|**Appendix A**<br>**Pre-works Site Investigation Checklist for Temporary Traffic Management on Managed Motorways**|**Appendix A**<br>**Pre-works Site Investigation Checklist for Temporary Traffic Management on Managed Motorways**|
|---|---|
|||
|Project:.......................................................................................................................................<br>Location:....................................................................................................................................<br>Date and Time:..............................................................................................................................||
|**Task**|**Completed**|
|Identify all LUMS, VSL and VMS:<br>•<br>Within the worksite boundary<br>•<br>One additional LUMS gantry upstream and downstream of the worksite|□|
|Identify all LUMS, VLS and VMS and gantry reference numbers|□|
|Identify any overhead VSL|□|
|Identify any LUMS, VSL and VMS that are inactive or defective within the vicinity of the<br>works|□|
|Identify any sight distance or visibility constraints associated with the LUMS, VSL and VMS|□|
|Determine approximate distances between successive LUMS|□|
|Identify any entry or exit ramps in relation to the worksite|□|
|Measure shoulder widths where advanced signage may be placed|□|
|Identify any nearby or adjacent worksites|□|
|Identify any road safety cameras within or adjacent to the worksite|□|
|Identify any other risk factors which may affect the implementation of effectiveness of the<br>LUMS, VSL or VMW for the temporary roadworks|□|
|Checklist completed by: ................................................................................. (Name)<br>................................................................................. (Company and Title)||



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [37] 

## **Appendix B** 

**Risk Assessment Checklist for Temporary Traffic Management on Managed Motorways** 

|**Appendix B**<br>**Risk Assessment Checklist for Temporary Traffic Management on Managed Motorways**|**Appendix B**<br>**Risk Assessment Checklist for Temporary Traffic Management on Managed Motorways**|
|---|---|
|||
|Project:.......................................................................................................................................<br>Location:....................................................................................................................................<br>Date and Time:..............................................................................................................................||
|**Task**|**Completed**|
|Where multiple worksites are proposed perform a risk assessment for each worksite|□|
|The risk assessment considers the need to extend the use of LUMS, VLS or VMS to address<br>any on-site constraints|□|
|The risk assessment has been used to determine the frequency of compliance safety<br>checks, based on the findings of the site inspection|□|
|The risk assessment has confirmed whether there is sufficient distance to allow drivers to<br>safely merge with the motorway mainline if works are proposed on the entry ramp|□|
|The risk assessment has confirmed whether there is sufficient distance to allow drivers to<br>slow down on the exit ramp if works are proposed on the exit ramp|□|
|The risk assessment has determined whether a generic TMP is suitable for mobile works,<br>and this has been justified and documented|□|
|The risk assessment has considered the potential for communication errors between traffic<br>management contractors and the TOC|□|
|The risk assessment has considered the potential for power failures and how this may<br>impact LUMS, VSL and VMS|□|
|The risk assessment has noted that system faults can occur at any time and may impact<br>LUMS, VSL and VMS|□|
|Checklist completed by: ................................................................................. (Name)<br>................................................................................. (Company and Title)||



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [38] 

## **Appendix C** 

|**Appendix C**|**Appendix C**|
|---|---|
|**On-road Signage Checklist for Temporary Traffic Management on Managed Motorways**||
|Project:.......................................................................................................................................<br>Location:....................................................................................................................................<br>Date and Time:..............................................................................................................................||
|**Task**|**Completed**|
|Review any locations where shoulder space constraints exist:<br>•<br>Signage has not been attached to median barriers<br>•<br>Signage attached to poles does not overhang into adjacent lanes<br>•<br>Signage has been placed on only one side of the road if there is limited shoulder space<br>•<br>Advanced VMS has been used if space constraints exist|□|
|Roadwork ahead signage has been used in accordance with AGTTM:<br>•<br>Signs have not been placed too far in advance of the worksite<br>•<br>Signs have been placed on both sides of the road, unless there are space constraints|□|
|Repeater signs have been used in accordance with AGTTM:<br>•<br>Repeater signs are placed within closed traffic lanes or on TMAs|□|
|End roadwork signs have been used in accordance with AGTTM:<br>•<br>‘END’ speed limit signs have not been used|□|
|Checklist completed by: ................................................................................. (Name)<br>................................................................................. (Company and Title)||



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [39] 

## **Appendix D** 

**LUMS and VMS Checklist for Temporary Traffic Management on Managed Motorways** 

Project:....................................................................................................................................... Location:.................................................................................................................................... Date and Time:.............................................................................................................................. **Task Completed** The proposed use of LUMS, VSL and VMS supports the on-road signage scheme □ The risk of a LUMS outage been considered during the development of the plan □ The length of the treatment been minimised, including implementing speed limit changes as □ close as possible to the on-road traffic management 

The need to extend the length of the LUMS treatment has been considered, including: 

- The prevailing speed limit of the motorway 

- Any instances of poor sight distance to the worksite 

- • Any instances of poor sight distance to on-road treatments such as bollards or TMAs • Entry and exit ramp configurations and locations 

- 

- • Length of the actual worksite 

- Location of any nearby road safety cameras 

- Grade of the road 

- Vehicle mix on the road adjacent to the worksite 

- Any other risk factors identified during the site investigation / risk assessment 

The following general approach been applied: 

- Advanced notification of works 

• Initial speed reduction combined with merge arrow □ • Further speed reduction combined with lane closure approaching and adjacent to the worksite • Once past the worksite, all lanes open and speeds back to the prevailing speed The TMP has identified any adjacent worksites, both up and downstream □ There are a minimum of two LUMS gantries between any adjacent worksites □ If the worksite is on an entry or exit ramp, the need for mainline speed reductions have been □ determined Contingency protocols been developed in the instance of any incidents near the worksite □ If mobile works are being performed, a mobile works response plan been developed including communication protocols with the TOC □ A LUMS and VMS implementation plan been developed and submitted with the TMP □ 

Checklist completed by: ................................................................................. (Name) ................................................................................. (Company and Title) 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [40] 

## **Appendix E** 

## **Works near Road Safety Cameras Checklist for Temporary Traffic Management on Managed Motorways** 

Project:....................................................................................................................................... Location:.................................................................................................................................... Date and Time:.............................................................................................................................. 

**Task** 

## **Completed** 

All road safety cameras within or adjacent to (upstream and downstream) the worksite have been identified 

□ 

With respect to the TMP, compliance with standards has been achieved including compliance with positioning of Roadwork Ahead signs, speed reduction signs, repeaters signs, End Roadwork signs and speed signs reinstating the speed limit 

□ 

The Department of Justice and Community Safety Victoria (DoJCSV) has been notified during the approvals phase of the proposed works and changes to speed limit 

□ 

Any non-compliant or non-standard arrangements have been disclosed to DoJCSV. 

□ 

The TMP has considered the changes to speed limits in the vicinity of any road safety cameras and the potential impacts to drivers 

□ 

Checklist completed by: ................................................................................. (Name) ................................................................................. (Company and Title) 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [41] 

## **Appendix F** 

**Approvals phase – Minimum Information to be Provided Checklist for Temporary Traffic Management on Managed Motorways** 

Project:....................................................................................................................................... Location:.................................................................................................................................... Date and Time:.............................................................................................................................. 

**Task Completed** All LUMS gantries, VLS and VMS board asset numbers have been provided in the LUMS □ and VMS implementation plan submitted as part of the TMP The TMP and LUMS / VMS implementation plan clearly define the duration of the works □ For long term works, the TMP and LUMS / VMS implementation plan clearly define the □ proposed changes to speed limits or lane utilisation Adjacent worksites been identified in the TMP and LUMS / VMS implementation plan, □ including any potential conflicts or overlapping requirements in the usage or LUMS or VMS 

> A single point of contact been nominated in the TMP and LUMS / VMS implementation plan □ 

Checklist completed by: ................................................................................. (Name) ................................................................................. (Company and Title) 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [42] 

## **Appendix G** 

**Implementation Phase Checklist for Temporary Traffic Management on Managed Motorways** 

|**Appendix G**<br>**Implementation Phase Checklist for Temporary Traffic Management on Managed Motorways**|**Appendix G**<br>**Implementation Phase Checklist for Temporary Traffic Management on Managed Motorways**|
|---|---|
|||
|Project:.......................................................................................................................................<br>Location:....................................................................................................................................<br>Date and Time:..............................................................................................................................||
|**Task**|**Completed**|
|An on-road risk assessment has been performed to identify any hazards or issues that were<br>not identified during the planning phase|□|
|Two separate phone calls have been made to the TOC:<br>•<br>Initial phone call to provide advanced warning to the TOC<br>•<br>Second phone call to initiate the implementation plan|□|
|During the phone calls to the TOC, the following information was available:<br>•<br>project reference number<br>•<br>approved TMP reference<br>•<br>site location including road being worked on and direction<br>•<br>extent of worksite<br>•<br>on-site contact details<br>•<br>TMP details including number of lanes to be closed, and what speed changes are<br>required from the default system<br>•<br>any changes to the approved TMP based on the on-site risk assessment<br>•<br>list of LUMS to be altered, including the gantry ID number for each<br>•<br>list of VMS to be altered, including asset numbers, and the proposed text to be displayed|□|
|A drive-through inspection has been performed to verify the successful execution of the<br>LUMS and VMS implementation plan.|□|
|The following principles have been followed:<br>•<br>no equipment has been moved on-road prior to the drive-through inspection being<br>performed<br>•<br>equipment has been placed on-road within 10 minutes of the drive-through inspection<br>being performed<br>•<br>inspection records have been made logging when the LUMS / VMS were altered and<br>when the drive-through inspection was performed|□|
|||
|||
|Checklist completed by: ................................................................................. (Name)<br>................................................................................. (Company and Title)||



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [43] 

## **Appendix H** 

- **On-road Signage Checklist for Temporary Traffic Management on Managed Motorways** Project:....................................................................................................................................... Location:.................................................................................................................................... Date and Time:.............................................................................................................................. **Task Completed** The nominated contact has called the TOC to inform them of the fault or incident □ TMAs have been maintained on-site to protect workers □ If LUMS, VSL signs or VMS are not operational or have blank displays, the following steps have been implemented: • Workers are permitted back on-site after the following has been implemented: `o` Lane closures and speed reductions have been reinforced by use of additional □ 

- static signage; 

- `o` Additional repeater signs have been installed to meet the requirements of AGTTM (if required); and 

- `o` VMS messages have been reinstated using TMA VMS boards 

- If LUMS / VSL signs can only display speeds and not lane utilisation, the following has been implemented: • lane closure signage has been reviewed and additional lane closure signage provided where required (i.e. lane allocation signs, chevrons etc); □ 

- • repeater signs have been set up on both sides of the road where speeds are 60km/h or lower; and 

- • VMS messages have been reinstated using TMA VMS boards If LUMS / VSL signs are displaying incorrect speeds, the following has been implemented: • if displayed speeds have reverted to prevailing or are otherwise displaying speeds that are higher than those on the TMP, all works have been stopped while the TOC is □ 

- contacted to rectify signs; or 

- • if displayed speeds are lower than those shown on the TMP the works have continued but the TOC has been contacted to rectify 

- If VMS signs are displaying incorrect message, the following has been implemented: • Advanced static signage has been reviewed to confirm that it meets the requirements of AGTTM; □ 

- • If not, additional advanced notification signage has been installed; and • TOC has been contacted and advised of the incorrect message For any fault that has occurred, a report has been submitted to the TOC with the following information: 

- identification of the affected LUMS gantries / VSL signs / VMS boards, including location description and ID number; 

- time of the incident; 

- cause of the fault (if known); and 

- a description of the steps undertaken during that shift to make the site safe in response to the fault 

Checklist completed by: ................................................................................. (Name) 

................................................................................. (Company and Title) 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [44] 

|||
|---|---|
|**Appendix I**<br>**De-mobilisation Checklist for Temporary Traffic Management on Managed Motorways**||
|Project:.......................................................................................................................................<br>Location:....................................................................................................................................<br>Date and Time:..............................................................................................................................||
|**Task**|**Completed**|
|The following process has been followed during the de-mobilisation of traffic management:<br>•<br>All physical infrastructure including static signage, bollards and TMAs have been<br>removed<br>•<br>A call to the TOC has been made to request LUMS/VMS to be reverted to their default<br>settings|□|
|During the phone calls to the TOC, the following information was available:<br>•<br>project reference number<br>•<br>approved TMP reference<br>•<br>site location including road being worked on and direction<br>•<br>extent of worksite<br>•<br>on-site contact details<br>•<br>TMP details including number of lanes that were closed, and what speed changes are<br>now required from the default system<br>•<br>any changes to the approved TMP based on the on-site risk assessment<br>•<br>list of LUMS to be altered, including the gantry ID number for each<br>•<br>list of VMS to be altered, including asset numbers, and the proposed text to be displayed|□|
|||
|Checklist completed by: ................................................................................. (Name)<br>................................................................................. (Company and Title)||



Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [45] 

## **8 DOCUMENT INFORMATION** 

|Title:|Temporary Traffic Management on Managed Motorways|
|---|---|
|Edition:|1.0|
|Department:|Assets and Engineering|
|Directorate:|Standards and Transport Engineering|
|Lead Author(s):|Road Engineering Standards|
|Authorised by:|Principal Engineer – Road and Traffic, Standards and Transport Engineering|
|Date of Authorisation:|November 2022|



|Document Revision History|Document Revision History|||
|---|---|---|---|
|Edition /<br>Revision|Pages(s)|Issue Date|Amendment Description|
|Edition 1.0|All|November 2022|First Edition|



DoT wishes to acknowledge the contribution of Smedley Technical and Strategic (SmedTech) in developing this document. 

**==> picture [146 x 41] intentionally omitted <==**

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [46] 

**==> picture [593 x 402] intentionally omitted <==**

Department of Transport 2022 

Except for any logos, emblems, trademarks, artwork and photography this document is made available under the terms of the Creative Commons Attribution 3.0 Australia license. This document is also available in an accessible format at transport.vic.gov.au 

Department of Transport (VIC) - Temporary Traffic Management on Managed Motorways Edition 1.0, November 2022 

> [47] 

