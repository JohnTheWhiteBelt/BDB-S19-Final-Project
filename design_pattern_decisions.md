# Design Pattern Decisions

All design patterns used and identified for current project are listed below

* **Access Restriction**

    Restrict the access to contract functionality according to suitable criteria. Used OpenZeppelin Ownable base contract, only owner of this contract withdraw ether.

* **Circuit Breaker/Emergency Stop)**
    
    Disable critical contract functionality in case of an emergency.

* **Withdrawal**
    
    Accounting logic and the transfer logic are seperated in ProofOfExistence.sol