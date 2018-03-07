# Energy Databrowser 2018

This repository contains work done to build an updated version of the original
[Energy Export Databrowser](http://mazamascience.com/OilExport/).

This project is sponsored by Mazama Science and co-sponsored by the Open Data Literacy project at the University of
Washington's [iSchool](https://ischool.uw.edu/).

## Team Members

 Jonathan Callahan -- advisor

## Databrowser Background

From the original databrowser [About Page](http://mazamascience.com/OilExport/about.html):

> Access to fossil fuels is one of the most important issues of our time. The world's largest economies are extremely
> dependent upon imported supplies of oil and gas. Understanding who produces and consumes oil, coal and natural gas
> is critical today and will remain so in the years ahead.

> This databrowser uses data from the 2017 BP Statistical Review and displays coal, oil & natural gas production
> and consumption timelines for each country in the database and several political and geographic groupings of nations.
> Users can dynamically plot import/export curves to get a sense of who the major fossil fuel producers and consumers
> are and how this has changed in the last four decades.

## Energy Background Reading

### Papers and presentations

 * [UNC Anthropologist paper on Peak Oil](http://www.unc.edu/~rdaniels/papers/EASA/Daniels-WhereIsAnthro-2010-06-10.pdf)
 * [Peak Oil presentation at CH2MHill](http://mazamascience.com/Presentations/Peak_Oil_by_the_Numbers.pdf)
 * [Peak Oil presentation at energy investment forum](http://mazamascience.com/Presentations/International_Energy_Trends.pdf)
 * [Peak Oil presenation at energy investment forum](http://mazamascience.com/Presentations/Oil_and_Gas_Panel.pdf)
 * [Nat. Gas presentation at ASPO conference](http://mazamascience.com/Presentations/Global_Gas_Trends.pdf)

### Posts at The Oil Drum with databrowser plots

 * [Energy Export Databrowser](http://www.theoildrum.com/node/4127)
 * [Current and Future Saudi and Russian Oil Production](http://www.theoildrum.com/node/7088)
 * [South America Enters the LNG World](http://www.theoildrum.com/node/7168)
 * [What's Behind Egypt's Problems?](http://www.theoildrum.com/node/7425)
 * [Egypt’s Natural Gas Trends and Potential Impacts](http://www.theoildrum.com/node/7477)
 * [Japan's Liquid Fuels Crisis](http://www.theoildrum.com/node/7726)
 * [What is "our" oil doing in their economy? -- Saudi Oil Consumption Trends](http://www.theoildrum.com/node/7767)
 * [Energy Export Databrowser Updated to BP 2013 Data](http://www.theoildrum.com/node/10029)


## Other Sources of Data

### Energy Information Administration (EIA)

https://www.eia.gov/petroleum/data.php

### Joint Oil Data Initiative (JODI)

https://www.jodidata.org

----

# Notes from 3/6/2018

Need more guidance on exactly what plots to create.

Some suggestions to break up the tasks:

 * create an html page with good HTML/CSS/bootstsrap desing (with help from Jon)
 * keep working on map as needed (but it looks pretty good)
 * disregard trade data and focus on annual by country statistics (production/consumption by fuel source)
 * use Papa Parse 4 (or d3) to ingest csv files
 * all plots should support a wide range of years and countries (but not necessarily all)
 * create scatter plot
 * create area plot
 * create stacked bar (stacked area?) pkot
 * stay in sync and share functions as much as possible (refactor/cleanup code)
 * test deployment on github IO
 

 
