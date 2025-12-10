"""
Module: q5_is_prime_module

Provides a function to check if a number is prime.
"""

def is_prime(n):
    """
    Determine whether a number is prime.
    
    Args:
        n (int): The number to check for primality.
    
    Returns:
        bool: True if n is a prime number, False otherwise.
    
    Examples:
        >>> is_prime(2)
        True
        >>> is_prime(17)
        True
        >>> is_prime(1)
        False
        >>> is_prime(4)
        False
    """
    if n <= 1:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True
