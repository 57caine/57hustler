import os
import tempfile
import unittest
from audit_data import audit

class AuditTests(unittest.TestCase):
    def make_csv(self, rows):
        f=tempfile.NamedTemporaryFile(mode="w",suffix=".csv",delete=False)
        with f:
            f.write("date,ticker,close\n"+rows)
        self.addCleanup(lambda: os.unlink(f.name))
        return f.name

    def test_valid_data_summary(self):
        path=self.make_csv("2025-01-02,X,100\n2025-01-03,X,101\n")
        report=audit(path,min_rows=1)
        self.assertEqual(report["tickers"]["X"]["rows"],2)
        self.assertEqual(report["common_dates"],2)

    def test_duplicate_date_rejected(self):
        path=self.make_csv("2025-01-02,X,100\n2025-01-02,X,101\n")
        with self.assertRaises(ValueError):
            audit(path,min_rows=1)

    def test_invalid_prices_rejected(self):
        for price in ["0","-1","nan","inf"]:
            with self.subTest(price=price):
                path=self.make_csv(f"2025-01-02,X,{price}\n")
                with self.assertRaises(ValueError):
                    audit(path,min_rows=1)

    def test_unsorted_dates_flagged(self):
        path=self.make_csv("2025-01-03,X,101\n2025-01-02,X,100\n")
        report=audit(path,min_rows=1)
        self.assertFalse(report["tickers"]["X"]["sorted"])

if __name__=="__main__":
    unittest.main()
