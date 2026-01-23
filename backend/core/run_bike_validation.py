import json
from pathlib import Path

from bike_validator import validate_bike


DATA_PATH = Path("../app/bikes/bikes.json")


def main():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    bikes = data.get("bikes", [])

    total = len(bikes)
    usable = 0

    field_failures = {
        "engine_cc": 0,
        "power_bhp": 0,
        "torque_nm": 0,
        "kerb_weight_kg": 0,
        "mileage_kmpl": 0,
    }

    for bike in bikes:
        result = validate_bike(bike)

        if result["is_usable"]:
            usable += 1

        for field, status in result["field_status"].items():
            if status != "valid":
                field_failures[field] += 1

    print("==== BIKE DATA VALIDATION REPORT ====")
    print(f"Total bikes     : {total}")
    print(f"Usable bikes    : {usable}")
    print(f"Rejected bikes  : {total - usable}")
    print(f"Usable %        : {round((usable / total) * 100, 2)}%")
    print("\nField-level issues:")
    for field, count in field_failures.items():
        print(f"  {field}: {count}")


if __name__ == "__main__":
    main()
