# AgriCore

---

## Project Specs

---

### Functionality for MVP

1. Inventory Management
   - Seeds
   - Equipment
   - Consumables
   - Assets?
2. Crop/Planting Management
   - Crop Planting
   - Harvesting
   - Yeild
3. Finance/Accounting
   - Honestly have no F-ing clue
4. Task List/Reminders
   - User created reminders
   - Up coming tasks like harvesting or planting date
   - Alerts for low stocks/Broken Equipment

### Extra Functionality

1. Storing photos of Inventory
2. Email alerts
3. Future planting system
   - To create a planting task for future, so the stock/consumables are
     deducted yet, but it's also not available to be used either.

- _The MVP shoudn't expect a big scale, i.e., Multiple plots/fields in a farm,
  Selling a variety of products, Making shipments for selling assets, having a
  storage container for Inventory_

## User Workflow and Functionality

---

### New User

- can't see any dashboard without Authentication
- Login/Signup options available
- Have a landing page

### Default Dashboard

- Small weather widget
- Upcoming tasks/Reminder list
- Have a Add new task/reminder button here

### Inventory Dashboard

- Broad Groups(Based on the attributes of the items in here)
  > Equipment(In Use,Broken,status,active)  
  > Seeds/Planting material  
  > Consumables(pesticides, fertilizers, etc)  
  > Assets? (Products produced on farm)
- The Groups have categories
  > Types of equipment  
  > Types of fertilizers and pesticides  
  > Different kind of seeds for same crop
  - Have a 'Add new category button'
  - Have a 'Add new item' button
- Add Items: This takes multiple inputs in a form and stores in DB, part of it
  is displayed in the table on the dashboard
- Add Items form entries
  1. Type name
  2. variety/category
  3. Unit(KGs, no. of items, Litres, pounds)
  4. linked to product(seed->crop)
  5. Alert when less than \_\_ quantity
  6. Description
- Table of Inventory
  1. Seeds(Name|Type|Available amt.|Unit|Price)
  2. Equipment(Name|Type|Brand|Status)
  3. Consumables(Names|Amount|Unit)

### Crops/Planting dashboard

- Table of all crops planted
- Attributes of table
  | Crop Type | Category | Planting date | Harvesting Date | Expected Yeild |
- Create new planting button/form
- Plantation form entries
  1. Crop Type
  2. Days to maturity(info from crop db model)
  3. Planting depth(info from crop db model)
  4. Estimated Loss rate
  5. Unit of measurement
  6. Expected yeild per 100ft
  7. Estimated revenue
- Add new crop type button/form
- Crop form entries
  1. Name
  2. Type
  3. Resources needed/usage
  4. Estimated growth rate(days to maturity)
  5. Yeild
  6. % of loss in yeild
  7. Planting depth?
  8. etc

### Tasks/To Do/Reminder

- Have a todo/reminder/button on every dashboard(maybe the navbar) to create an
  entry on the default homepage

### Accounting/Finance dashboard
