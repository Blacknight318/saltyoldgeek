---
title: "MOSFET Failures: When Theory Meets Reality"
description: Dive into a real-world MOSFET failure case in electric motors. Learn why hands-on experience is crucial in electronics repair.
author: saltyoldgeek
date: 2022-08-15 16:04:00 -0500
categories: [Blogging]
tags: [engineering, real-world failures, case study, electric motors, control boards, h-bridge circuit, MOSFET, transistor operation, electronics repair, practical experience]
---

Engineers can come up with some great ideas but sometimes reality has to just burst that bubble. I've worked with a few engineers over the years I've done electronics and computer repair, most are good guys, but some are heavy on paper and theoretical and light on practical experience. This brings us to today's story.

I was working for a company that designed and produced electric motors, some brushed and some brushless, the brushless motors needed a control board. This control board sent power back and forth through a coil using what's called an h-bridge circuit. This circuit relies on four MOSFETs, acting like gates or switches. The component, like most electronics, wear out over time and some are just DOA.

A quick refresher on MOSFET and Transistor operation, all have three leads, one is the source, one is the drain, and one is the gate. When the gate is triggered by either a positive or negative voltage(depending on the type, ie NPN or PNP) then electricity is allowed to flow from source to drain. Using a pair on either side of the coil you can control the motor direction, speed, and power. For anyone who's looked at an AC or radio signal on an oscilloscope or EKG, you're familiar with a sin wave. When one of the MOSFETs fails it clips one side of that wave short. This will be important in just a second.

Now to reality meeting the engineer. We received a motor back stating that it was locking up and had no power. The first thing I did was hook it up to my bench power supply and test the motor(with and without a fan blade attached) and watched the power going through the coil.  I noticed something odd, normally when a MOSFET cuts off one side of the wave goes completely flat(like a dead short) but this one was chopped part way through that portion of the wave. After checking all the support circuitry I came to the conclusion that the gate on one MOSFET was leaking and causing the MOSFET to turn on when the source power reached a certain point regardless of whether that MOSFET was supposed to be on. This could be a manufacturing defect in the component or premature wear, it wasn't a complete failure but enough to cause the issues that were reported.

Taking the report to the engineer he refused to believe that there could be a partial failure, even after I removed and tested that particular component. I later heard that he called BS on my conclusion in a department head meeting and was challenged by another engineer saying something along the lines of "you do know how a MOSFET works right?". This was because that engineer understood, and had experienced, that real-life failures can be messy and incomplete and that the "leakage" described in the report was valid if somewhat rare failure mode.

The engineer who questioned the report wasn't necessarily a bad engineer but did tend to make decisions based on theoretical design specs on paper. Where he assumed that all failure modes and specs matched paper, I tended to want to see proof of that failure. Having spent years with over-engineered equipment in the Navy where you had to prove the failure, I tended to go where the data lead me rather than falling back on theory and design specs. Even a relatively good tire can blow out due to some unseen defect, life is messy and complicated.
