# Avoiding Common Attacks

All measures took to ensure that contracts are not susceptible to common attacks listed below.

* **Re-entracy Attacks**

    ProofOfExistence.sol doesn't have any external calls so it's immune to this attack.

* **Transaction Ordering and Timestamp Dependence**
    
    ProofOfExistence.sol is using "now" as timestamp, 15~20 seconds deviation is acceptable. No caculation is based on time.

* **Integer Overflow and Underflow**
    
    No math calculation is used. So it's immune to this attack. 

* **Denial of Service**
    
    ProofOfExistence.sol doesn't have any external calls so it's immune to this attack.

* **Denial of Service by Block Gas Limit (or startGas)**
    
    ProofOfExistence.sol try not to iterate an undetermined size array.
    
 * **Force Sending Ether**
    
    No function of ProofOfExistence.sol depends on its balance, so it's immune to this attack.
 