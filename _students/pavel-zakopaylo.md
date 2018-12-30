---
name: Pavel Zakopaylo
degree: project
start_year: 2017
status: current
---

Pavel is interested in software security and embedded devices. Falling prices
for WiFi-enabled micro-controllers has created the *Internet of Things* (IoT):
small, low-cost devices that frequently drive physical systems ranging from
network-connected light bulbs to large-scale industrial processes. These devices
have a limited runtime with very little encapsulation, which means even simple
vulnerabilities can cause full compromise of the system.

The goal of this research is to develop security analysis methods of these
embedded devices. In particular we aim to assess the security of ARM's
[mbedOS](https://www.mbed.com/en/platform/mbed-os/), an operating system that
abstracts over certain low-level security-critical components, such as the
network stack. More specifically, we emulate the ARM core and its various
hardware peripherals to enable fuzzing---a process in which large amounts of
computer-generated data is input into a program until it malfunctions. Depending
on the source of the malfunction, this information can be used to craft inputs
that allow an attacker's code to be executed on the device.

<!-- For more information, visit <https://gitlab.anu.edu.au/cybsersec/fuzzing-mbed-stm32> -->
