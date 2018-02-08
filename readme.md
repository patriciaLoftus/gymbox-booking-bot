# Gymbox Class Booker

Book classes programatically so you can sleep in

## setup

You need phantommjs installed for this to run - install with
```
npm install phantomjs -g
```

## Environment variables

| Variable   | Description                           |
|------------|---------------------------------------|
| `USERNAME` | Username used to login to Gymbox      |
| `PASSWORD` | Password used to login to Gymbox      |

## Example JSON Schedule

The schedule JSON uses days of the week as root-level keys which contain an array of classes. Each class has a `Name` key which is the name of the class and a `StartTime` key which is the 24hr class time

```JSON
{
  "Tuesday": {
    "WestfieldStratford": [
      {
        "Name": "Bike & Beats",
        "StartTime": "07:00"
      },
      {
        "Name": "Tour De Stratford",
        "StartTime": "12:00"
      }
    ]
  },
}
```
