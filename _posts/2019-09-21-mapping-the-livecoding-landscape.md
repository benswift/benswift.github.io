---
title: Mapping the livecoding landscape
tags: livecoding research
published: false

# let's do this as YAML
livecoding_people:
  -
    name: Andrew Sorensen
    affiliation:
      institution:
      type: indie
    url: "https://twitter.com/digego"
    famous_for: Extempore, Impromptu
  -
    name: Alex McLean
    affiliation:
      institution:
      type: indie
    url: "https://yaxu.org"
    famous_for: tidalcycles, lcilp
  -
    name: Juilan Rohrhuber
    affiliation:
      institution: Institute for Music and Media, RSH Düsseldorf
      type: music
    url: "http://wertlos.org/~rohrhuber/"
    famous_for: SuperCollider JITLib
  -
    name: Andrew Brown
    affiliation:
      institution: Queensland College of Art, Griffith University
      type: art
    url: "http://andrewrbrown.net.au/"
    famous_for: aa cell
  -
    name: Nick Collins
    affiliation:
      institution: Department of Music, Durham University
      type: music
    url: "https://www.dur.ac.uk/music/staff/profile/?id=11477"
    famous_for: livecoding, LCILP
  -
    name: Thor Magnusson
    affiliation:
      institution: Music Department, University of Sussex
      type: music
    url: "http://thormagnusson.github.io/"
    famous_for: ixi lang
  -
    name: Ge Wang
    affiliation:
      institution: CCRMA, Stanford University
      type: music
    url: "https://www.gewang.com"
    famous_for: Chuck
  -
    name: Sam Aaron
    affiliation:
      institution:
      type: indie
    url: "http://sam.aaron.name/"
    famous_for: Sonic Pi
  -
    name: Alan Blackwell
    affiliation:
      institution: Cambridge Computer Laboratory
      type: CS
    url: "https://www.cl.cam.ac.uk/~afb21/"
    famous_for: cognitive dimensions of notation
  -
    name: Dave Griffiths
    affiliation:
      institution: FoAM Kernow
      type: indie
    url: "https://fo.am/people/dave/"
    famous_for:
  -
    name: Shelley Knotts
    affiliation:
      institution: Department of Music, Durham University
      type: music
    url: "https://shellyknotts.wordpress.com"
    famous_for: algobabez, OFFAL
  -
    name: Joanne Armitage
    affiliation:
      institution: School of Media and Communication, University of Leeds
      type: media
    url: "https://twitter.com/joannnne"
    famous_for: algobabez
  -
    name: Renick Bell
    affiliation:
      institution:
      type: indie
    url: "http://renickbell.net/"
    famous_for: livecoding
  -
    name: David Ogborn
    affiliation:
      institution: Department of Communication Studies and Multimedia, McMaster University
      type: media
    url: "http://www.dktr0.net"
    famous_for: cybernetic orchestra
  -
    name: Charlie Roberts
    affiliation:
      institution: Computer Science, Worcester Polytechnic Institute
      type: CS
    url: "http://charlie-roberts.com/"
    famous_for: gibber
  -
    name: Kate Sicchio
    affiliation:
      institution: Integrated Digital Media, New York University
      type: art
    url: "http://blog.sicchio.com/"
    famous_for:
  -
    name: Mauro
    affiliation:
      institution:
      type:
    url: "https://www.cyberpunk.net.ar"
    famous_for: awesome livecoding
  -
    name: Jack Armitage
    affiliation:
      institution: Centre for Digital Music, Queen Mary University of London
      type: CS
    url: "https://www.jackarmitage.com/"
    famous_for: tidlecycles livecoding, bela
  -
    name: Luis Navarro Del Angel
    affiliation:
      institution: Department of Communication Studies and Multimedia, McMaster University
      type: media
    url: "http://luisnavarrodelangel.net/"
    famous_for:
---

## People

<ul>
{% for person in page.people %}
<li>
  <a style="font-weight: 900;" href="{{ person.url }}">{{ person.name }}</a>,
  <span style="font-style: italic;">{{ person.affiliation.institution }}</span>
</li>
{% endfor %}
</ul>

## ICLC committees

### 2020 Limerick, Ireland

Programme Chair: Giuseppe Torre

Performances Chair: Neil O'Connor

Workshops Chair: Nicholas Ward

Installations Chair: Nora O Murchú

### 2019 Madrid, Spain

Chair - Jesús Jara López
Co-Chair - Lina Bautista
Co-Chair - Iván Paz
Performance Chair - Juan A. Romero
Scientific Chair - Enrike Hurtado
Installations/Workshops Coordinator - Joaquín Díaz Durán
Production Adviser - Maite Camacho
Identity & Web - Adrián Cano/Jana Domínguez
Assistance - Live Code Mad

### 2017 Morelia, México

#### Core organising committee

Chair - Alexandra Cárdenas
Co-Chair Ernesto Romero
Co-Chair Luis Navarro del Angel
Performance Chair - Jorge Ramírez
Scientific Chair - Juan Sebastián Lach
Production Adviser - Minerva Hernández Trejo
Identity & Web - Karen del Valle, Rodrigo Velasco, Felipe Ignacio
Networks - Malitzin Cortés

#### Steering Committee

David Ogborn, Chair (McMaster University)
Alex McLean (Deutsches Museum)
Shelly Knotts (Durham University)
Thor Magnusson (University of Sussex)
Kate Sicchio (New York University)
Graham Wakefield (York University)

### 2016 McMaster University, Canada

#### Local organising committee

David Ogborn, General chair (McMaster University)
Graham Wakefield, Co-chair (York University)
Christina Baade, Scientific programme committee chair (McMaster University)
Kate Sicchio, Artistic programme committee chair (New York University)
Tanya Goncalves, Workshops chair (McMaster University)
Harold Sikkema, Design and videography coordinator (McMaster University)

#### Steering committee

Alex McLean, Chair (FoAM Kernow)
Shelly Knotts (Durham University)
Thor Magnusson (University of Sussex)
David Ogborn (McMaster University)
Kate Sicchio (Parsons the New School for Design)
Graham Wakefield (York University)

#### Programme committee

Samuel Aaron (University of Cambridge)
Amy Alexander (University of California, San Diego)
Juan Alzate Romero (IMWI - HfM Karlsruhe)
Joanne Armitage (University of Leeds)
Christina Baade (McMaster University)
Holger Ballweg (Northumbria University)
Sara Bannerman (McMaster University)
Renick Bell
Yael Benn (Manchester Metropolitan University)
Daven Bigelow (McMaster University)
Alan Blackwell (University of Cambridge)
Patrick Borgeat (University of Music, Karlsruhe)
Victoria Bradbury (Alfred University / NYSCC / SoAD)
Karen Burland (University of Leeds)
Pam Burnard (University of Cambridge)
Alexandra Cárdenas (University of the Arts, Berlin)
Jacques Carette (McMaster University)
Luke Church (University of Cambridge)
Geoff Cox (Aarhus University)
Georg Essl (University of Michigan)
Andrew Fischer (Shutterfly, Inc)
Paula Gardner (McMaster University)
Tanya Goncalves (McMaster University)
Tom Hall (Anglia Ruskin University)
Mike Hodnick
Aaron Hutchinson (Hamilton Audio-Visual Node)
Ian Jarvis (York University)
Ali Khajehei (McMaster University)
Chris Kiefer (University of Sussex)
Shelly Knotts (Durham University)
Shawn Lawson (Rensselaer Polytechnic Institute)
Sang Won Lee (University of Michigan)
Thor Magnusson (University of Sussex)
Alex McLean (FoAM Kernow)
James Noble (Victoria University of Wellington)
Matthew Paine (McMaster University)
Roly Perera (University of Glasgow, University of Edinburgh)
Charlie Roberts (Rochester Institute of Technology)
Julian Rohrhuber (Institute For Music And Media, Robert Schumann Hochschule)
Adriana Sa (Goldsmiths College, University of London)
Kate Sicchio (Parsons the New School for Design)
Harold Sikkema (McMaster University)
Dagobert Sondervan
Andrew Sorensen
Dana Swarbrick (McMaster University)
Ben Swift (Australian National University)
Steven Tanimoto (University of Washington)
Eldad Tsabary (Concordia University)
Anne Veinberg (Orpheus Institute/Leiden University/Conservatorium Amsterdam)
Graham Wakefield (York University)
Joseph Wilk (Poetic Computation)
Scott Wilson (University of Birmingham)
Matthew Yee-King (Goldsmiths College, University of London)
Andrea Zeffiro (McMaster University)

### 2015 University of Leeds, UK

#### Core organising committee

Alex McLean, General chair (University of Leeds)
Thor Magnusson, Co-chair (University of Sussex)
Kia Ng, Scientific programme committee chair (University of Leeds)
Shelly Knotts, Artistic programme committee chair (University of Durham)
Joanne Armitage, Workshop and special events chair (University of Leeds)

#### Evening event producer

Ash Sagar

#### External advisors

Juan A. Romero
Patrick Borgeat

#### Programme committee

_same as 2016_

## TOPLAP nodes

This list is pinched _directly_ from the [TOPLAP
website](https://toplap.org/nodes/) (as at 21 Sep 2019):

- [Livecode NYC](http://livecode.nyc/) (USA)
- [TOPLAP Node Yorkshire](https://www.facebook.com/groups/1683408058575303/) (UK)
- [TOPLAP Node North-East](https://www.facebook.com/groups/897471030365142/) (UK)
- [TOPLAP Node México](https://www.facebook.com/toplap.mx/) (MX)
- [Cybernetic Orchestra](https://www.facebook.com/groups/toplapnodeberlin/1725919034313087/) (CA)
- [TOPLAP Berlin](https://www.facebook.com/groups/toplapnodeberlin/1725919034313087/) (DE)
- [TOPLAP Medellín](https://noiskate.hotglue.me/?ToplapMedellin) (CO)
- [TOPLAP Bogotá](https://www.facebook.com/groups/626111581071250/) (CO)
- [TOPLAP Quito](https://www.facebook.com/groups/583681711997021/) (EC)
- [TOPLAP Lima](https://www.facebook.com/groups/362002184270964/) (PE)
- [TOPLAP Buenos Aires](https://livecodear.github.io/) (AR)
- [Live coding à Montréal](https://montreal.toplap.org) (CA)
- [TOPLAP Barcelona](https://toplapbarcelona.hangar.org/) (ES)
- [TOPLAP Japan](https://twitter.com/toplapjp) (JP)
- [NL_CL (Netherlands Coding Live) node](https://netherlands-coding-live.github.io) (NL)
- [Live coding @ IMPA (Rio de Janeiro)](http://w3.impa.br/~vitorgr/livecode/) (BR)
- [TOPLAP Greater Bay Area](https://www.facebook.com/groups/353595622030440/) (CN)
- [Tidalclub Sheffield](https://tidalclub.github.io/sheffield.html) (UK)
- [CLiC (Colectivo de Live Coders)](https://colectivo-de-livecoders.gitlab.io/) (AR)
- [Livecode New England](http://livecodenewengland.org/) (USA)
- [TOPLAP Italia](https://www.facebook.com/groups/1051671308353969/) (IT)
- [TOPLAP France](https://www.facebook.com/groups/toplapfr/) (FR)
- [Algorave France & Belgique](http://algorave.fr/) (FR/BE)
- [Live Coding Frankfurt](https://www.meetup.com/Live-Coding-Frankfurt/) (DE)
- [TOPLAP Valdiva](https://toplapvaldivia.wixsite.com/website) (CL)
- [LiveCoding Düsseldorf](https://www.facebook.com/groups/587715001671363/) (DE)
