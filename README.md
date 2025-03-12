# Seattle Housing Price Insights

## Project Overview

This project provides an interactive visualization of housing trends and rent prices in Seattle. Users can explore census tracts, analyze apartment prices, and gain insights into the city's housing market. The primary focus is on mapping median rent prices and single-family home ownership across different neighborhoods using geospatial techniques like heatmaps and choropleth maps.

By leveraging digital geography methods, this project aims to highlight spatial disparities, affordability, and market fluctuations in Seattle’s housing sector.

## Target Audience

The target audience includes:
- Students and Researchers interested in housing economics, digital geography, and spatial analysis.
- City Planners and Policymakers looking to understand housing affordability and distribution.
- Renters and Home Buyers: seeking insights into price trends in different areas of Seattle.
- Real Estate Analysts and Investors evaluating neighborhood-level market trends.

## Main Functions

Interactive Map: Displays rent statistics for apartments and ownership statistics for single-family homes by Census Tract in the Greater Seattle area.
- Users can zoom into neighborhoods categorized by North, Central, West, and South Seattle.
- Clicking on a census tract reveals detailed information, including the neighborhood name, census tract number, price per square foot, and median price.

Choropleth Map Toggle: Allows users to switch between apartment and single-family home data.
- The choropleth visualization shows price variations across census tracts, making it easy to compare affordability and market trends.

Heatmap and Choropleth of Seattle’s Median Housing Market for an intuitive comparison of housing prices.

## Project Goal

This project provides an interactive and visually engaging platform for exploring Seattle’s housing market. Through thematic maps, users can compare housing costs across neighborhoods, making it a valuable resource for renters, home buyers, city planners, and researchers.

With affordable housing being a growing concern, this application helps users identify potential areas for investment or relocation by visualizing key trends like median rent prices and home sale values. By simplifying market analysis, it empowers users to make informed decisions about Seattle’s housing landscape.

## Results from this Application

Census Tract with the Lowest Median Price:
 - Single Family: $569,900 - South Park (Tract 11200)
 - Apartments: $845 - South Park (Tract 11200)

Census Tract with the highest Median Price:
 - Single Family: $2,550,000 - Madison Park (Tract 6300)
 - Apartments: $3167 - Cascade/Eastlake (Tract 7302)

Census Tract with the lowest price per Sq. Ft:
 - Single Family: $297.44 - South Beacon Hill / New Holly (Tract 11002)
 - Apartments: $1.3 - South Park (Tract 11200)

Census tract with the highest price per Sq. Ft:
 - Single Family $806.56 - Madison Park (Tract 6300)
 - Apartments: $4.5 - Ravenna/Bryant (Tract 4301)


### Areas of interest:

Single Family: For single family areas, many of the properties with the highest prices tend to be near bodies of water, while the more affordable options tend to be towards more land areas. In terms of Single Family homes, there tends to be no data in the downtown area, as the urban areas may be targeted towards young adults and older who want to be closer to their job. Furthermore, there wouldn't be anywhere to build single family homes given most of the buildings in the downtown area.


Apartments: Apartments tend to be concentrated in the downtown area, with the most expensive ones being right in the heart of Seattle. This is due to the fact that you would likely not use transportation as much, and since many businesses are located in the area, it would only make the rent prices increase to stay competitive. 

### Areas of potential development:

Some potential areas of interest include SoDo and South/West Seattle, where more industrial businesses take residence. To potentially increase business there, available spaces may want to take advantage to build homes with a similar price to the homes nearby. By creating potential residences there at a price lower than the higher areas, it may attract potential investors of business and increase foot traffic to businesses there.

## Icon

![apple-touch-icon](https://github.com/user-attachments/assets/d30350fd-5a45-4eba-8b22-a0d2ae8829b5)


## Application URL

URL: https://fila10.github.io/SeattleHousingMarket/index.html 

## Screenshots

![Interactive-Map](https://github.com/fila10/SeattleHousingMarket/blob/main/images/Interactive_TractMap.png)

Interactive Map Screenshot

![Median-SqFt-Properties](https://github.com/fila10/SeattleHousingMarket/blob/main/images/MedianSqFtProperties_ChMap.png)

Median and Sq. Ft Choropleth Map Screenshot

![Median-Home-Value](https://github.com/fila10/SeattleHousingMarket/blob/main/images/MedianHomeValue_HeatMap.png)

Median Home Value Heat Map Screenshot

## Data Sources

Seattle Apartment Market Rent Prices by Census Tract (2023-2024)
- https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::apartment-market-rent-prices-by-census-tract/about 
- This dataset provides median rental prices for apartments across Seattle census tracts for the years 2023 and 2024.

Seattle Single-Family Home Sale Prices by Census Tract (2003-2024)
- https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::single-family-home-sale-prices-by-census-tract/about
- This dataset contains historical and recent median sale prices for single-family homes, spanning from 2003 to 2024.

## Applied Libraries

Mapbox, GitHub, CSS, JavaScript, GeoJSON

## Acknowledgements

Throughout our project, we used ChatGPT to help edit and improve the rough drafts of our code. 
