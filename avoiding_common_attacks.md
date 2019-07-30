# Avoiding Common Attacks

All measures took to ensure that contracts are not susceptible to common attacks listed below.

* **Re-entracy Attacks**

    using withdrawal pattern to seperate accounting logic and the transfer logic.

* **Transaction Ordering and Timestamp Dependence**
    
    ProofOfExistence.sol is using "now" as timestamp, 15~20 seconds deviation is acceptable. No caculation is based on time.

* **Integer Overflow and Underflow**
    
    OpenZepplin SafeMath library is used.

* **Denial of Service**
    
    using withdrawal to avoid this attack.

* **Denial of Service by Block Gas Limit (or startGas)**
    
    ProofOfExistence.sol try not to iterate an undetermined size array.
    
 * **Force Sending Ether**
    
    No function of ProofOfExistence.sol depends on its balance, so it's immune to this attack.
 